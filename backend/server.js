require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/Auth');
const requireAuth = require('./middleware/auth');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB(process.env.MONGO_URI);

// Middleware
app.use(cookieParser());
// If you need cross-origin requests from your React frontend on http://localhost:3000:
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Example of a protected route
app.get('/api/protected', requireAuth, (req, res) => {
  res.status(200).json({ message: 'You have accessed a protected route!', userId: req.userId });
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
