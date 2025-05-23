// routes/ratings.js
const express = require('express');
const router  = express.Router();
const PlayerRating = require('../models/playerRating');
const requireAuth  = require('../middleware/auth'); // if you want it protected

/* ------------------------------------------------------------------ *
 * GET /api/ratings/:userId  – fetch a player’s current rating        *
 * ------------------------------------------------------------------ */
router.get('/:userId', async (req, res) => {
  try {
    const ratingDoc = await PlayerRating.findOne({ user: req.params.userId })
                                        .select('-_id rating rd gamesPlayed updatedAt');
    if (!ratingDoc) return res.status(404).json({ msg: 'Rating not found' });
    res.json(ratingDoc);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

/* ------------------------------------------------------------------ *
 * POST /api/ratings/update  – update ratings after a finished game   *
 * body = { winnerId, loserId [, draw=false] }                        *
 * ------------------------------------------------------------------ */
router.post('/update', requireAuth, async (req, res) => {
  try {
    const { winnerId, loserId, draw = false } = req.body;

    // Grab both docs in parallel
    const [wDoc, lDoc] = await Promise.all([
      PlayerRating.findOne({ user: winnerId }),
      PlayerRating.findOne({ user: loserId  })
    ]);

    if (!wDoc || !lDoc) return res.status(404).json({ msg: 'One or both players missing ratings' });

    // Calculate new ratings
    if (draw) {
      wDoc.applyElo(lDoc.rating, 0.5);
      lDoc.applyElo(wDoc.rating, 0.5);
    } else {
      wDoc.applyElo(lDoc.rating, 1);   // winner scores 1
      lDoc.applyElo(wDoc.rating, 0);   // loser scores 0
    }

    await Promise.all([wDoc.save(), lDoc.save()]);

    res.json({
      winner: { id: winnerId, rating: wDoc.rating },
      loser:  { id: loserId,  rating: lDoc.rating  }
    });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
