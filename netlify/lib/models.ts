import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userID: { type: String, required: true },
  accountID: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  location: { type: String },
});

const userSettingsSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    dateFormat: { type: String, default: "MM/dd/yyyy" },
    currency: { type: String, default: "USD" },
  },
  { timestamps: true },
);

export const TransactionModel =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);

export const UserSettingsModel =
  mongoose.models.UserSettings ||
  mongoose.model("UserSettings", userSettingsSchema);
