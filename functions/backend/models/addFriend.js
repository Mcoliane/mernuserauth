const { db } = require("../config/firebaseAdmin");

async function addFriend(userUid, friendUsername) {
    const snapshot = await db.ref("users").once("value");
    const users = snapshot.val();

    let friendUid = null;
    let friendData = null;

    for (const uid in users) {
        if (users[uid].username?.toLowerCase() === friendUsername.toLowerCase()) {
            friendUid = uid;
            friendData = users[uid];
            break;
        }
    }

    if (!friendUid) {
        throw new Error("User not found");
    }

    const userFriendRef = db.ref(`users/${userUid}/friends/${friendUid}`);
    const friendFriendRef = db.ref(`users/${friendUid}/friends/${userUid}`);

    await userFriendRef.set(true);       // or friendData.username if you want to store more info
    await friendFriendRef.set(true);     // mutual friendship

    return { friendUid, friendUsername: friendData.username };
}
async function addFriendByUsername(userUid, friendUsername) {
    const snapshot = await db.ref("users").once("value");
    const users = snapshot.val();

    let friendUid = null;

    for (const uid in users) {
        if (users[uid].username?.toLowerCase() === friendUsername.toLowerCase()) {
            friendUid = uid;
            break;
        }
    }

    if (!friendUid) {
        throw new Error("User not found");
    }

    const userFriendRef = db.ref(`users/${userUid}/friends/${friendUid}`);
    const friendFriendRef = db.ref(`users/${friendUid}/friends/${userUid}`);

    await userFriendRef.set(true);
    await friendFriendRef.set(true);

    return { friendUid, friendUsername };
}


module.exports = { addFriend, addFriendByUsername };