const { db } = require("../config/firebaseAdmin");
const { applyElo } = require("./elo");

// Set initial rating when user signs up
async function setInitialPlayerRating(uid) {
    const ratingRef = db.ref(`users/${uid}/stats`);
    await ratingRef.set({
        rating: 1200,
        rd: 350,
        gamesPlayed: 0,
        updatedAt: new Date().toISOString()
    });
}


// Update a single player's rating (used internally)
async function updateSingleRating(uid, newRating, gamesPlayed) {
    const ref = db.ref(`users/${uid}/stats`);
    await ref.update({
        rating: newRating,
        gamesPlayed,
        updatedAt: new Date().toISOString()
    });
}

// Get current rating from DB
async function getRating(uid) {
    const snapshot = await db.ref(`users/${uid}/stats`).once("value");
    if (!snapshot.exists()) throw new Error(`No stats for uid: ${uid}`);
    return snapshot.val();
}

async function updatePlayerRating(uid, opponentRating, score) {
    const userRef = db.ref(`users/${uid}/stats`);
    const snapshot = await userRef.once("value");

    if (!snapshot.exists()) return;

    const data = snapshot.val();
    const newRating = applyElo(data.rating, opponentRating, score);

    await userRef.update({
        rating: newRating,
        gamesPlayed: (data.gamesPlayed || 0) + 1,
        updatedAt: new Date().toISOString()
    });
}

module.exports = { setInitialPlayerRating, updatePlayerRating };
