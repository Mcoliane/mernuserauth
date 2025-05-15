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
        // Generate and save unique invite code
        const inviteCode = generateShortCode();
        const userRef = db.ref(`users/${uid}`);
        await userRef.set({
            username,
            email,
            bio: "",
            friends: {},
            stats: {}, // placeholder, will be populated below
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
router.post("/add-friend-by-code", async (req, res) => {
    const { userUid, inviteCode } = req.body;

    try {
        // Find user by inviteCode field
        const usersSnap = await db.ref("users").orderByChild("inviteCode").equalTo(inviteCode).once("value");
        if (!usersSnap.exists()) {
            return res.status(404).json({ error: "User with that code not found" });
        }

        const friendUid = Object.keys(usersSnap.val())[0];

        // Add mutual friendship
        await db.ref(`users/${userUid}/friends/${friendUid}`).set(true);
        await db.ref(`users/${friendUid}/friends/${userUid}`).set(true);

        res.json({ message: "Friend added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
