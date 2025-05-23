const express = require("express");
const router = express.Router();

const { db } = require("../config/firebaseAdmin");

const { updatePlayerRating } = require("./playerRating");

const generateShortCode = () => {
    let code = "";
    while (code.length < 4) {
        code += Math.random().toString(36).substring(2);
    }
    return code.substring(0, 4).toUpperCase();
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
    const { uid, email } = req.body;
    let { username } = req.body;

    const usersRef = db.ref('users'); // for querying all users

    // Function to check if username exists
    const usernameExists = async (name) => {
        const snapshot = await usersRef.orderByChild('username').equalTo(name).once('value');
        return snapshot.exists();
    };

    if (await usernameExists(username)) {
        // Generate unique username
        let unique = false;
        while (!unique) {
            const generated = username + generateShortCode();
            const exists = await usernameExists(generated);
            if (!exists) {
                username = generated;
                unique = true;
            }
        }
    }

    try {
        const userRef = db.ref(`users/${uid}`); // correct: user-specific path
        await userRef.set({
            username,
            email,
            bio: "",
            friends: {},
            stats: {},
        });
        res.status(201).json({ message: "User registered with initial rating" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update user bio
router.post("/update-bio", async (req, res) => {
    const { uid, bio } = req.body;

    if (!uid || bio === undefined) {
        return res.status(400).json({ error: "uid and bio are required" });
    }

    try {
        const userRef = db.ref(`users/${uid}`);
        await userRef.update({ bio });
        res.status(200).json({ message: "Bio updated successfully" });
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
