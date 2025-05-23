const admin = require("firebase-admin");

const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
if (!base64) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is missing");

const serviceAccount = JSON.parse(
  Buffer.from(base64, "base64").toString("utf-8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chess-25eb7-default-rtdb.firebaseio.com/"
  });
}

const db = admin.database();
const auth = admin.auth();

module.exports = { db, auth, admin };
