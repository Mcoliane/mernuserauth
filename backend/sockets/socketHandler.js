// socketHandlers.js
const {rooms} = require("./rooms");

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


const handleRankedQueue = (socket, io, rooms, waitingPlayer) => {
    socket.on("join-ranked-queue", () => {
        if (socket.isInQueue) return;
        socket.isInQueue = true;

        if (waitingPlayer && waitingPlayer.id !== socket.id) {
            const opponent = waitingPlayer;
            waitingPlayer = null;

            const room = `ranked-${socket.id}-${opponent.id}`;
            socket.join(room);
            opponent.join(room);

            const assignWhite = Math.random() < 0.5;
            const white = assignWhite ? socket : opponent;
            const black = assignWhite ? opponent : socket;

            white.emit("ranked-match-found", {assignedColor: "w"});
            black.emit("ranked-match-found", {assignedColor: "b"});

            // Clear their in-queue flags
            white.isInQueue = false;
            black.isInQueue = false;

            // Track the current turn (White starts)
            let currentTurn = "w"; // "w" is White, "b" is Black
            const boardState = {}; // Add your board state representation here (FEN or move history)

            // Handle move events
            [white, black].forEach((player) => {
                player.on("move", ({from, to}) => {
                    // Only allow the player whose turn it is to make a move
                    if ((player === white && currentTurn !== "w") || (player === black && currentTurn !== "b")) {
                        console.log(`Invalid move: ${from} -> ${to}, not ${player.id}'s turn`);
                        return;
                    }

                    console.log(`Move in ${room} from ${player.id}: ${from} -> ${to}`);

                    // Validate the move (if applicable)
                    // Your chess game logic here to validate the move

                    // After a valid move, toggle the turn
                    currentTurn = currentTurn === "w" ? "b" : "w";

                    // Broadcast the move to the opponent
                    player.to(room).emit("move", {from, to, boardState});

                    // Update the board state (e.g., FEN or move history)
                    // Update `boardState` here based on the move
                });

                player.on("ranked-game-over", ({winner}) => {
                    player.to(room).emit("ranked-game-over", {winner});
                });
            });
        } else {
            waitingPlayer = socket;
        }
    });
};


module.exports = {handleRoomJoin, handleRankedQueue};
