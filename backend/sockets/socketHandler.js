const { rooms } = require("./rooms");
const { updatePlayerRating } = require("../models/playerRating");
const { db } = require("../config/firebaseAdmin"); // ✅ You were missing this

const handleRoomJoin = (socket, io) => {
  socket.on("join-room", (roomCode) => {
    console.log(`Room join request received for room ${roomCode}`);
    socket.join(roomCode);

    if (!rooms[roomCode]) {
      rooms[roomCode] = [];
    }

    if (rooms[roomCode].length >= 2) {
      socket.emit("room-full");
      return;
    }

    rooms[roomCode].push(socket.id);
    const color = rooms[roomCode].length === 1 ? "w" : "b";
    socket.emit("player-color", color);

    console.log(`Player ${socket.id} joined room ${roomCode} as ${color}`);
  });
};

const matchmakingQueue = {
  waitingPlayer: null,
};

const handleRankedQueue = (socket, io) => {
  socket.on("join-ranked-queue", ({ uid }) => {
    if (socket.isInQueue) return;
    socket.isInQueue = true;

    const waiting = matchmakingQueue.waitingPlayer;

    if (waiting && waiting.socket.id !== socket.id) {
      const opponent = waiting.socket;
      const opponentUid = waiting.uid;

      matchmakingQueue.waitingPlayer = null;

      const room = `ranked-${socket.id}-${opponent.id}`;
      socket.join(room);
      opponent.join(room);

      const assignWhite = Math.random() < 0.5;
      const white = assignWhite ? socket : opponent;
      const black = assignWhite ? opponent : socket;

      white.emit("ranked-match-found", { assignedColor: "w" });
      black.emit("ranked-match-found", { assignedColor: "b" });

      white.isInQueue = false;
      black.isInQueue = false;

      let currentTurn = "w";
      const boardState = {};

      const handleMove = (player, from, to) => {
        if ((player === white && currentTurn !== "w") || (player === black && currentTurn !== "b")) {
          console.log(`Invalid move from ${player.id}: not your turn`);
          return;
        }

        console.log(`Move in ${room} from ${player.id}: ${from} -> ${to}`);
        currentTurn = currentTurn === "w" ? "b" : "w";
        io.to(room).emit("move", { from, to, boardState });
      };

      const handleGameOver = async (player, winnerUid, loserUid) => {
        io.to(room).emit("ranked-game-over", { winnerUid });

        try {
          const winnerSnap = await db.ref(`users/${winnerUid}/stats`).once("value");
          const loserSnap = await db.ref(`users/${loserUid}/stats`).once("value");

          if (!winnerSnap.exists() || !loserSnap.exists()) {
            return console.warn("Player stats missing");
          }

          const winnerRating = winnerSnap.val().rating || 1200;
          const loserRating = loserSnap.val().rating || 1200;

          await updatePlayerRating(winnerUid, loserRating, 1);
          await updatePlayerRating(loserUid, winnerRating, 0);

          console.log("✅ Elo ratings updated");
        } catch (err) {
          console.error("🔥 Error updating Elo:", err);
        }
      };

      [white, black].forEach((player) => {
        player.on("move", ({ from, to }) => handleMove(player, from, to));
        player.on("ranked-game-over", ({ winnerUid, loserUid }) =>
          handleGameOver(player, winnerUid, loserUid)
        );

        player.on("disconnect", () => {
          io.to(room).emit("opponent-left");
        });
      });
    } else {
      matchmakingQueue.waitingPlayer = { socket, uid };
      console.log(`[QUEUE] ${uid} is now waiting for a match`);
    }
  });
};

module.exports = { handleRoomJoin, handleRankedQueue };
