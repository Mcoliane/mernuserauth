// routes/Auth.js
const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');

const User         = require('../models/User');
const PlayerRating = require('../models/playerRating');

/* ------------------------------------------------------------------ *
 * POST /api/auth/register                                            *
 * ------------------------------------------------------------------ */
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1️⃣  Duplicate-email guard
    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'User already exists' });

    // 2️⃣  Create the User (password is auto-hashed via pre-save hook)
    const newUser = await User.create({ username, email, password });

    // 3️⃣  Bootstrap their initial rating
    await PlayerRating.bootstrapForUser(newUser._id);

    // 4️⃣  Sign JWT
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 5️⃣  Set http-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production', // HTTPS only in prod
      sameSite: 'strict',
      maxAge:   24 * 60 * 60 * 1000                    // 1 day
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ------------------------------------------------------------------ *
 * POST /api/auth/login                                               *
 * ------------------------------------------------------------------ */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge:   24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ------------------------------------------------------------------ *
 * POST /api/auth/logout                                              *
 * ------------------------------------------------------------------ */
router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
