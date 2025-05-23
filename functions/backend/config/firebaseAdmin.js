const admin = require("firebase-admin");

const serviceAccount = require("../serviceAccountKey.json"); // secure this file!

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://chess-25eb7-default-rtdb.firebaseio.com/"
    });
}

const db = admin.database();
const auth = admin.auth();

module.exports = { db, auth, admin };