const mongoose = require("mongoose");
require("dotenv").config();

async function connectDb() {
  try {
    console.log("🔄 Attempting to connect to:", process.env.MONGODB_URI?.split("@")[1] || "Unknown");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("❌ DB Error:", error.message);
  
  }
}

module.exports = connectDb;
