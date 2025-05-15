const { doc, updateDoc, arrayUnion } = require("firebase/firestore");
const { auth, db } = require("../config/firebaseAdmin");

async function addFriend(friendUid) {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
        friends: arrayUnion(friendUid)
    });
}
module.exports = {addFriend};