const mongoose = require("mongoose");

const connectDB = async (uri) => {
  const mongoUri = uri || process.env.MONGO_URI || process.env.MONGO_URL;

  if (!mongoUri) {
    console.error("❌ No MongoDB URI found in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
