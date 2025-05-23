const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("./server");

// ✅ Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// ✅ Optional: Use specific region (e.g., us-central1)
exports.api = functions
  .region("us-central1")
  .https.onRequest(app);
