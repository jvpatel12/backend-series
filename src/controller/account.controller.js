const accountModel = require("../model/account.model");

async function createAccount(req, res) {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
}

async function getAccount(req, res) {
  try {
    const user = req.user;

    const account = await accountModel.findOne({ user: user._id }).populate("user", "email name");

    if (!account) {
      return res.status(404).json({
        message: "Account not found for this user",
      });
    }

    res.status(200).json({
      account: {
        _id: account._id,
        user: account.user,
        status: account.status,
        currency: account.currency,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
      message: "Account fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching account",
      error: error.message,
    });
  }
}

async function getAllAccounts(req, res) {
  try {
    const user = req.user;

    const accounts = await accountModel
      .find({ user: user._id })
      .populate("user", "email name")
      .sort({ createdAt: -1 });

    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        message: "No accounts found for this user",
        accounts: [],
      });
    }

    res.status(200).json({
      accounts: accounts.map((account) => ({
        _id: account._id,
        user: account.user,
        status: account.status,
        currency: account.currency,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      })),
      totalAccounts: accounts.length,
      message: "All accounts fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching accounts",
      error: error.message,
    });
  }
}

module.exports = { createAccount, getAccount, getAllAccounts };
