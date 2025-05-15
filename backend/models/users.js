const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseAdmin");
const { setInitialPlayerRating, updatePlayerRating } = require("./playerRating");

router.get("/:uid", async (req, res) => {
    try {
        const userRef = db.ref(`users/${req.params.uid}`);
        const snapshot = await userRef.once("value");

        if (!snapshot.exists()) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(snapshot.val());
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Register user (this would be called after Firebase Auth registration on the frontend)
router.post("/register", async (req, res) => {
    const { uid, username, email } = req.body;

    try {
        const userRef = db.ref(`users/${uid}`);
        await userRef.set({
            username,
            email,
            bio: "",
            friends: {},
            stats: {} // placeholder, will be populated below
        });

        // ✅ Initialize player rating
        await setInitialPlayerRating(uid);

        res.status(201).json({ message: "User registered with initial rating" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Elo rating
router.post("/update-elo", async (req, res) => {
    const { uid, opponentUid, result } = req.body;

    try {
        const opponentSnap = await db.ref(`users/${opponentUid}/stats`).once("value");
        if (!opponentSnap.exists()) {
            return res.status(404).json({ error: "Opponent not found" });
        }

        const opponentRating = opponentSnap.val().rating;

        await updatePlayerRating(uid, opponentRating, result);

        res.status(200).json({ message: "Elo updated" });
    } catch (err) {
        console.error("Error updating Elo:", err);
        res.status(500).json({ error: "Failed to update Elo" });
    }
});
module.exports = router;
