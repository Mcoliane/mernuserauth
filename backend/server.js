require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const CryptoJS = require("crypto-js");

// 🔌 Custom Modules
const connectDB = require("./config/db");
const friendRoutes = require("./routes/friends");
const authRoutes = require("./routes/auth");
const tournamentRoutes = require("./routes/tournamentRoutes");
const requireAuth = require("./middleware/auth");
const { handleRoomJoin, handleRankedQueue } = require("./sockets/socketHandler");
const { rooms } = require("./sockets/rooms");

// ✅ Firebase Admin connection
const { db } = require("./config/firebaseAdmin");

// 🔒 Secret key for encryption (TODO: move to .env in prod)
const SECRET_KEY = "your_shared_secret_key";

// ✅ Connect to MongoDB
connectDB(process.env.MONGO_URI);

// ✅ Initialize Express + HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ✅ Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ✅ Mount REST API routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/tournaments", tournamentRoutes);

// ❌ DO NOT mount models as routes
// app.use("/api/users", require("./models/users")); ← This is bad
// If you need a real `/api/users` route, make a new `routes/users.js` file

// ✅ Fallback for unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// =======================
// ♟️ GAME SOCKET NAMESPACE
// =======================
const gameNamespace = io.of("/chess");
gameNamespace.on("connection", (socket) => {
  console.log("[CHESS] Connected:", socket.id);

  handleRoomJoin(socket, io, rooms);
  handleRankedQueue(socket, io, rooms);

  socket.on("move", ({ room, from, to, promotion }) => {
    console.log(`[MOVE] ${socket.id}: ${from} → ${to} in ${room}`);
    socket.to(room).emit("move", { from, to, promotion });
  });

  socket.on("game-over", ({ room, winner }) => {
    console.log(`[GAME OVER] ${room}: Winner = ${winner}`);
    socket.to(room).emit("game-over", { winner });
  });

  socket.on("disconnecting", () => {
    for (const room of socket.rooms) {
      if (room !== socket.id && rooms[room]) {
        rooms[room] = rooms[room].filter((id) => id !== socket.id);
        gameNamespace.to(room).emit("opponent-left");
        if (rooms[room].length === 0) delete rooms[room];
      }
    }
    socket.isInQueue = false;
    console.log("[CHESS] Disconnected:", socket.id);
  });
});

// =======================
// 💬 CHAT SOCKET NAMESPACE
// =======================
const chatNamespace = io.of("/chat");

chatNamespace.on("connection", (socket) => {
  console.log("[CHAT] Connected:", socket.id);

  socket.on("send_message", (data) => {
    const decrypted = decryptMessage(data.text);
    console.log(`[Chat] ${data.user}: ${decrypted}`);
    chatNamespace.emit("receive_message", data);
  });

  socket.on("typing", () => {
    socket.broadcast.emit("user_typing");
  });

  socket.on("disconnect", () => {
    console.log("[CHAT] Disconnected:", socket.id);
  });
});

// 🔐 Utility Functions
const decryptMessage = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

const encryptMessage = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

// =======================
// 🚀 START SERVER
// =======================
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
