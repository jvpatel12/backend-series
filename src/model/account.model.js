const mongoose = require("mongoose");
const ledgerModel = require("./ledger.model");

const accountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // take a refernce another model create user
      ref: "user",
      required: [true, "Account must be associated with user"],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Stautus can be active forzon and closed",
      },
      default: "ACTIVE",
    },
    currency: {
      type: String,
      required: [true, "currency is required for create account"],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);

accountSchema.index({ user: 1, status: 1 }); //compound index

accountSchema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.aggregate([
    {
      $match: {  // match query for fillter the data for spewcfic account 
        account: this._id,
      },
      $group: {   // group query calculate the toal debit and credit for specific account and calculate the balance by subtarct
        _id: null,
        totalDebit: {
          $sum: {
            $cond: [
              {
                $eq: ["$type", "$DEBIT"],
              },
              "$amount",
              0,
            ],
          },
        },
        totalCredit: {
          $sum: {
            $cond: [{ $eq: ["$type", "$CREDIT"] }, "$amount", 0],
          },
        },
        $project: {
          _id: 0,
          balance: {
            $subtract: ["$totalCredit", "$totalDebit"],
          },
        },
      },
    },
  ]);

  if (balanceData.length === 0) {
    return 0;
  }
  return balanceData[0].balance;
};

const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;
