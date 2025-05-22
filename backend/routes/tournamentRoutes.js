const express = require('express');
const router = express.Router();
const { db } = require("../config/firebaseAdmin");
const { v4: uuid } = require('uuid');

// Join a tournament
router.post('/join/:tournamentId', async (req, res) => {
    const { tournamentId } = req.params;
    const { uid, username } = req.body;

    await db.ref(`tournaments/${tournamentId}/players/${uid}`).set({ username, status: "registered" });

    res.status(200).json({ message: "Successfully registered." });
});

// Start tournament and pair players
router.post('/start/:tournamentId', async (req, res) => {
    const { tournamentId } = req.params;
    const playersSnapshot = await db.ref(`tournaments/${tournamentId}/players`).once('value');
    const playersData = playersSnapshot.val();

    if (!playersData) return res.status(400).json({ message: "No players registered." });

    const players = Object.keys(playersData);
    if (players.length % 2 !== 0) return res.status(400).json({ message: "Need even number of players." });

    let pairings = [];
    for (let i = 0; i < players.length; i += 2) {
        pairings.push({
            player1Uid: players[i],
            player2Uid: players[i + 1],
            gameRoomId: uuid(),
            winnerUid: null
        });
    }

    await db.ref(`tournaments/${tournamentId}/rounds/round1`).set(pairings);
    await db.ref(`tournaments/${tournamentId}`).update({ status: "in_progress" });

    res.status(200).json({ pairings });
});

// List all tournaments
router.get('/', async (req, res) => {
    const snapshot = await db.ref('tournaments').once('value');
    const tournaments = snapshot.val(); // ← ⚠ This may be null or an object, not an array
    if (!tournaments) return res.json([]);

    const list = Object.entries(tournaments).map(([id, data]) => ({
        id,
        name: data.name || id,
        status: data.status || 'pending',
        playerCount: data.players ? Object.keys(data.players).length : 0
    }));

    res.json(list);
});


// ✅ Get a single tournament
router.get('/:id', async (req, res) => {
    const snapshot = await db.ref(`tournaments/${req.params.id}`).once('value');
    if (!snapshot.exists()) return res.status(404).json({ message: 'Tournament not found' });
    res.json(snapshot.val());
});

// Get pairings for player
router.get('/pairings/:tournamentId/:uid', async (req, res) => {
    const { tournamentId, uid } = req.params;
    const pairingsSnapshot = await db.ref(`tournaments/${tournamentId}/rounds/round1`).once('value');
    const pairings = pairingsSnapshot.val();

    if (!pairings) {
        return res.status(404).json({ message: "No pairings found yet." });
    }

    const match = pairings.find(m => m.player1Uid === uid || m.player2Uid === uid);
    if (!match) return res.status(404).json({ message: "No match found." });

    res.status(200).json(match);
});

module.exports = router;
