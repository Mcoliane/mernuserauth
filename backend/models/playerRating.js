// models/PlayerRating.js
const mongoose = require('mongoose');

const playerRatingSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    rating:      { type: Number, default: 1200 },
    rd:          { type: Number, default: 350 },          // Rating deviation (Glicko / Glicko-2)
    gamesPlayed: { type: Number, default: 0 },
    updatedAt:   { type: Date,   default: Date.now }
  },
  { versionKey: false } // we don’t need __v for this doc
);

/* --------------------------------------------------------- *
 *  Static helpers                                           *
 * --------------------------------------------------------- */

/** Create an initial rating doc (call right after a user signs up) */
playerRatingSchema.statics.bootstrapForUser = async function (userId) {
  return this.create({ user: userId });
};

/* --------------------------------------------------------- *
 *  Instance helpers                                         *
 * --------------------------------------------------------- */

/**
 * Update Elo ratings for   this   player vs an opponent.
 * @param {Number} opponentRating – their current Elo
 * @param {Number} score          – 1 = win, 0.5 = draw, 0 = loss
 * @param {Number} [k=32]         – K-factor (tune to taste)
 * @returns {Number} new rating   – *rounded* to an int
 */
playerRatingSchema.methods.applyElo = function (opponentRating, score, k = 32) {
  const expected = 1 / (1 + Math.pow(10, (opponentRating - this.rating) / 400));
  this.rating = Math.round(this.rating + k * (score - expected));
  this.gamesPlayed += 1;
  this.updatedAt = new Date();
  return this.rating;
};

module.exports = mongoose.model('PlayerRating', playerRatingSchema);
