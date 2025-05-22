require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const friendRoutes = require('./routes/friends');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth');
const requireAuth = require('./middleware/auth');
const registerUser = require('./models/users');
const CryptoJS = require("crypto-js");
const SECRET_KEY = "your_shared_secret_key";

// ✅ ADD THIS
const tournamentRoutes = require('./routes/tournamentRoutes');

// Online connection
const { Server } = require("socket.io");
const http = require("http");
const { handleRoomJoin, handleRankedQueue } = require("./sockets/socketHandler");
const { waitingPlayer, rooms } = require("./sockets/rooms");

// Initialize Express
const app = express();
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

// Middleware
app.use(cookieParser());
app.use(express.json());

// ✅ Mount all real API routes first
app.use('/api/users', require("./models/users"));
app.use('/api/friends', friendRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tournaments', tournamentRoutes);

// ✅ Fallback must come LAST
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found' });
});


// =======================
// 🎯 GAME NAMESPACE LOGIC
// =======================
const gameNamespace = io.of("/chess");
gameNamespace.on('connection', (socket) => {
    console.log('[CHESS] Connected:', socket.id);

    handleRoomJoin(socket, io, rooms);
    handleRankedQueue(socket, io, rooms);

    socket.on('move', ({ room, from, to, promotion }) => {
        console.log(`[MOVE] ${socket.id} moved from ${from} to ${to} in room ${room}`);
        socket.to(room).emit('move', { from, to, promotion });
    });

    socket.on('game-over', ({ room, winner }) => {
        console.log(`[GAME OVER] ${room}: Winner is ${winner}`);
        socket.to(room).emit('game-over', { winner });
    });

    socket.on('disconnecting', () => {
        for (const room of socket.rooms) {
            if (room !== socket.id && rooms[room]) {
                rooms[room] = rooms[room].filter(id => id !== socket.id);
                gameNamespace.to(room).emit('opponent-left');
                if (rooms[room].length === 0) delete rooms[room];
            }
        }
        socket.isInQueue = false;
        console.log('[CHESS] Disconnected:', socket.id);
    });
});

// =======================
// 💬 CHAT NAMESPACE LOGIC
// =======================
const decryptMessage = (cipherText) => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptMessage = (plainText) => {
    return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

const chatNamespace = io.of("/chat");
chatNamespace.on("connection", (socket) => {
    console.log("[CHAT] User connected:", socket.id);

    socket.on("send_message", (data) => {
        const decrypted = decryptMessage(data.text);
        console.log(`[Chat] ${data.user}:`, decrypted);
        chatNamespace.emit("receive_message", data);
    });

    socket.on("typing", () => {
        socket.broadcast.emit("user_typing");
    });

    socket.on("disconnect", () => {
        console.log("[CHAT] User disconnected:", socket.id);
    });
});

// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
