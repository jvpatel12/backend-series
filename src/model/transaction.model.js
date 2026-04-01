const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have a sender"],
      index: true,
    },
    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must have a receiver"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Transaction amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
      default: "PENDING",
    },
    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required"],
      unique: true, // ✅ VERY IMPORTANT
      index: true,
    },
    type: {
      type: String,
      enum: ["TRANSFER", "INITIAL_FUND"],
      default: "TRANSFER",
    },
  },
  { timestamps: true }
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;