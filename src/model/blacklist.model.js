const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required"],
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
    index: true,
  },
  expiresAt: {
    type: Date,
    required: [true, "Expiration time is required"],
    index: true,
    // Automatically delete expired tokens after 24 hours
    expires: 86400,
  },
  reason: {
    type: String,
    enum: ["LOGOUT", "PASSWORD_CHANGE", "ACCOUNT_SUSPENDED", "MANUAL"],
    default: "LOGOUT",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Automatically delete blacklist entry after token expires
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklistModel = mongoose.model("Blacklist", blacklistSchema);

module.exports = blacklistModel;
