require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth');
const requireAuth = require('./middleware/auth');
const CryptoJS = require("crypto-js");

const SECRET_KEY = "your_shared_secret_key";

// Online connection
const {Server} = require("socket.io");
const http = require("http");
const {handleRoomJoin, handleRankedQueue} = require("./sockets/socketHandler");
const {waitingPlayer, rooms} = require("./sockets/rooms");


// Initialize Express
const app = express();
app.use(cors({
    origin: '*',  // This can be more restrictive (e.g., `http://localhost:3000`) if needed
    methods: ['GET', 'POST'], allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Initialize socket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Replace '*' with the specific client URL if you want more restrictions
        methods: ["GET", "POST"],
    },
});


// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Middleware
app.use(cookieParser());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Example of a protected route
app.get('/api/protected', requireAuth, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!', userId: req.userId });
});
const gameNamespace = io.of("/game");
gameNamespace.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    // Handle room join and ranked queue logic
    handleRoomJoin(socket, io, rooms);
    handleRankedQueue(socket, io, rooms, waitingPlayer);

    socket.on('disconnecting', () => {
        console.log('Player disconnected:', socket.id);
        // Remove player from ranked queue if disconnected

        socket.isInQueue = false;

        // Clean up rooms when player disconnects
        for (const room of socket.rooms) {
            if (room !== socket.id && rooms[room]) {
                rooms[room] = rooms[room].filter(id => id !== socket.id);
                if (rooms[room].length === 0) delete rooms[room];
            }
        }
    });
});

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
        // You can decrypt it here if needed (for logging or moderation)
        const decrypted = decryptMessage(data.text);
        console.log(`[Chat] ${data.user}:`, decrypted);

        // Broadcast encrypted (or original)
        io.of("/chat").emit("receive_message", data);
    });

    socket.on("typing", () => {
        socket.broadcast.emit("user_typing"); // notify others
    });

    socket.on("disconnect", () => {
        console.log("[CHAT] User disconnected:", socket.id);
    });
});

// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log('Server running on port ${PORT}'));


