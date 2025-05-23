const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const friendRoutes = require("./routes/friends");
const authRoutes = require("./routes/auth");

app.use("/api/friends", friendRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🎯");
});

module.exports = app;
