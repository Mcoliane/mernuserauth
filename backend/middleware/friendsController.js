const { db } =  require('../config/firebaseAdmin');
const { ref, get, update } = require('firebase/database');

// Search user
async function searchUserByUsernameHandler(req, res) {
    const username = req.params.username.toLowerCase().trim();
    const snapshot = await get(ref(db, 'users'));
    const users = snapshot.val();

    for (const uid in users) {
        const user = users[uid];
        if (user.username?.toLowerCase().trim() === username) {
            return res.json({ uid, ...user });
        }
    }

    res.status(404).json({ error: 'User not found' });
}

// Send request
async function sendFriendRequestHandler(req, res) {
    const { targetUid, fromUid, fromUsername } = req.body;

    const updates = {};
    updates[`users/${targetUid}/friendRequests/incoming/${fromUid}`] = fromUsername || true;
    updates[`users/${fromUid}/friendRequests/outgoing/${targetUid}`] = true;

    await update(ref(db), updates);
    res.status(200).json({ success: true });
}

// Get incoming requests
async function getIncomingRequestsHandler(req, res) {
    const { uid } = req.params;
    const snapshot = await get(ref(db, `users/${uid}/friendRequests/incoming`));
    res.json(snapshot.val() || {});
}

// Respond to request
async function respondToFriendRequestHandler(req, res) {
    const { currentUid, fromUid, accept } = req.body;

    const updates = {
        [`users/${currentUid}/friendRequests/incoming/${fromUid}`]: null,
        [`users/${fromUid}/friendRequests/outgoing/${currentUid}`]: null,
    };

    if (accept) {
        updates[`users/${currentUid}/friends/${fromUid}`] = true;
        updates[`users/${fromUid}/friends/${currentUid}`] = true;
    }

    await update(ref(db), updates);
    res.status(200).json({ success: true });
}

// Get friends
async function getFriendsHandler(req, res) {
    const { uid } = req.params;
    const snapshot = await get(ref(db, `users/${uid}/friends`));
    res.json(snapshot.val() || {});
}
module.exports = {
    searchUserByUsernameHandler,
    sendFriendRequestHandler,
    getIncomingRequestsHandler,
    respondToFriendRequestHandler,
    getFriendsHandler
};