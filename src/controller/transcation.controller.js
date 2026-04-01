const transactionModel = require("../model/transaction.model");
const ledgerModel = require("../model/ledger.model");
const accountModel = require("../model/account.model");
const emailService = require("../services/email.service");
const mongoose = require("mongoose");

/**
 * USER TO USER TRANSFER
 */
async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey)
    return res.status(400).json({ message: "Missing required fields" });

  if (amount <= 0)
    return res.status(400).json({ message: "Amount must be positive" });

  const existing = await transactionModel.findOne({ idempotencyKey });
  if (existing)
    return res
      .status(200)
      .json({ message: "Transaction exists", transaction: existing });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sender = await accountModel.findById(fromAccount).session(session);
    const receiver = await accountModel.findById(toAccount).session(session);

    if (!sender || !receiver) throw new Error("Accounts not found");
    if (sender.status !== "ACTIVE" || receiver.status !== "ACTIVE")
      throw new Error("Accounts must be ACTIVE");

    const balance = await sender.getBalance({ session });
    if (balance < amount) throw new Error("Insufficient balance");

    const [transaction] = await transactionModel.create(
      [
        {
          fromAccount,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
          type: "TRANSFER",
        },
      ],
      { session },
    );

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Email notification (non-blocking)
    emailService
      .sendTransactionEmail(
        req.user.email,
        req.user.name,
        amount,
        fromAccount,
        toAccount,
      )
      .catch(console.error);

    return res
      .status(201)
      .json({ message: "Transfer successful", transaction });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err.message });
  }
}

/**
 * SYSTEM INITIAL FUNDING
 */
async function createSystemInitialFunds(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!req.user.systemUser)
    return res
      .status(403)
      .json({ message: "Forbidden access you are not system user" });

  if (!toAccount || !amount || !idempotencyKey)
    return res.status(400).json({ message: "Missing required fields" });

  if (amount <= 0)
    return res.status(400).json({ message: "Amount must be positive" });

  const existing = await transactionModel.findOne({ idempotencyKey });
  if (existing)
    return res
      .status(200)
      .json({ message: "Transaction exists", transaction: existing });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const systemAccount = await accountModel
      .findOne({ systemUser: true })
      .session(session);
    if (!systemAccount) throw new Error("System account not configured");

    const receiver = await accountModel.findById(toAccount).session(session);
    if (!receiver) throw new Error("Receiver account not found");
    if (receiver.status !== "ACTIVE")
      throw new Error("Receiver account must be ACTIVE");

    const [transaction] = await transactionModel.create(
      [
        {
          fromAccount: systemAccount._id,
          toAccount,
          amount,
          idempotencyKey,
          status: "PENDING",
          type: "INITIAL_FUND",
        },
      ],
      { session },
    );

    await ledgerModel.create(
      [
        {
          account: systemAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
        {
          account: toAccount,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json({ message: "Initial funds added successfully", transaction });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return res.status(400).json({ message: err.message });
  }
}

/**
 * GET ACCOUNT BALANCE
 */
async function getBalance(req, res) {
  try {
    const { accountId } = req.params;

    const account = await accountModel.findById(accountId);

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }

    // Check if user owns this account
    if (account.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Forbidden: You don't have access to this account",
      });
    }

    const balance = await account.getBalance();

    res.status(200).json({
      account: {
        _id: account._id,
        accountNumber: account._id,
        balance: balance,
        currency: account.currency,
        status: account.status,
      },
      message: "Balance fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching balance",
      error: error.message,
    });
  }
}

module.exports = {
  createTransaction,
  createSystemInitialFunds,
  getBalance,
};
