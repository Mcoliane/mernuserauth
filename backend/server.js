require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth');
const requireAuth = require('./middleware/auth');
const { Game } = require("js-chess-engine");

// Online connection
const { Server } = require("socket.io");
const http = require("http");


// Initialize Express
const app = express();
app.use(cors({
    origin: '*',  // This can be more restrictive (e.g., `http://localhost:3000`) if needed
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Initialize socket
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Replace '*' with the specific client URL if you want more restrictions
        methods: ["GET", "POST"],
    },
});


// // Connect to MongoDB
// connectDB(process.env.MONGO_URI);

// Middleware
app.use(cookieParser());

app.use(express.json());

// Routes
// app.use('/api/auth', authRoutes);
//
// // Example of a protected route
// app.get('/api/protected', requireAuth, (req, res) => {
//   res.status(200).json({ message: 'You have accessed a protected route!', userId: req.userId });
// });

io.on('connection', (socket) => {
    console.log('Connected:', socket.id);

    // Handle room join and ranked queue logic
    handleRoomJoin(socket, io, rooms);
    handleRankedQueue(socket, io, rooms, waitingPlayer);

    socket.on('disconnecting', () => {
        console.log('Player disconnected:', socket.id);
        // Remove player from ranked queue if disconnected
        if (waitingPlayer === socket) {
            waitingPlayer = null;
        }
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


// Start the server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log('Server running on port ${PORT}'));


