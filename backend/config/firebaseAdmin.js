const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

// Safe, conditional initialization
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://chess-25eb7-default-rtdb.firebaseio.com/"
  });
}

// Export the initialized services
const db = admin.database();
const auth = admin.auth();

module.exports = { db, auth, admin };
