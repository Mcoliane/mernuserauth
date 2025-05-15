// socketHandlers.js
const {rooms} = require("./rooms");
const { updatePlayerRating } = require("../models/playerRating");
const handleRoomJoin = (socket, io, rooms) => {
    socket.on('join-room', (roomCode) => {
        console.log(`Room join request received for room ${roomCode}`);
        socket.join(roomCode);

        if (!rooms[roomCode]) {
            rooms[roomCode] = [];
        }

        if (rooms[roomCode].length >= 2) {
            socket.emit('room-full');
            return;
        }

        rooms[roomCode].push(socket.id);
        const color = rooms[roomCode].length === 1 ? 'w' : 'b';
        socket.emit('player-color', color);

        console.log(`Player ${socket.id} joined room ${roomCode} as ${color}`);
    });
};


const handleRankedQueue = (socket, io, rooms, waitingPlayerWrapper) => {
    socket.on("join-ranked-queue", ({ uid }) => {
        if (socket.isInQueue || !uid) return;

        socket.isInQueue = true;
        socket.uid = uid; // Store UID on socket

        const waitingPlayer = waitingPlayerWrapper.player;

        if (waitingPlayer && waitingPlayer.id !== socket.id) {
            const opponent = waitingPlayer;
            waitingPlayerWrapper.player = null;

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

            const sockets = { w: white, b: black };
            const uids = { w: white.uid, b: black.uid };

            let currentTurn = "w";

            [white, black].forEach((player) => {
                player.on("move", ({ from, to }) => {
                    const playerColor = player === white ? "w" : "b";
                    if (playerColor !== currentTurn) return;

                    currentTurn = currentTurn === "w" ? "b" : "w";
                    player.to(room).emit("move", { from, to });
                });

                player.on("ranked-game-over", async ({ winner }) => {
                    if (winner !== "w" && winner !== "b") return;

                    const loser = winner === "w" ? "b" : "w";
                    try {
                        await updatePlayerRating(
                            uids[winner],
                            uids[loser],
                            1 // winner gets 1 point
                        );
                    } catch (err) {
                        console.error("Failed to update Elo ratings:", err);
                    }

                    io.to(room).emit("ranked-game-over", {
                        winner,
                        updatedRatings
                    });
                });

            });
        } else {
            waitingPlayerWrapper.player = socket;
        }
    });
};


module.exports = {handleRoomJoin, handleRankedQueue};
