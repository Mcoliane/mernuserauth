const express = require("express");
const router = express.Router();
const { db } = require("../config/firebaseAdmin");

const { setInitialPlayerRating, updatePlayerRating } = require("./playerRating");
const { addFriend, addFriendByUsername} = require('./addFriend');

const generateShortCode = () => {
    let code = "";
    while (code.length < 6) {
        code += Math.random().toString(36).substring(2);
    }
    return code.substring(0, 6).toUpperCase();
};

router.get('/:uid', async (req, res) => {
    const { uid } = req.params;
    try {
        const snapshot = await db.ref(`users/${uid}/username`).once('value');
        const username = snapshot.val();
        if (!username) return res.status(404).json({ error: 'User not found' });
        res.json({ username });
    } catch (error) {
        console.error('Error fetching username:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Register user (this would be called after Firebase Auth registration on the frontend)
router.post("/register", async (req, res) => {
    const { uid, username, email } = req.body;

    try {
        // Generate and save unique invite code
        const inviteCode = generateShortCode();
        const userRef = db.ref(`users/${uid}`);
        await userRef.set({
            username,
            email,
            bio: "",
            friends: {},
            stats: {},
            inviteCode,
        });
        console.log("Generated invite code:", inviteCode);
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
