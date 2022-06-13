const { default: mongoose } = require("mongoose");

const requestConfirmationSchema = new mongoose.Schema({
  uId: { type: String, required: true },
  amount: { type: Number, required: true },
  sName: { type: String },
  rBankName: { type: String },
  sAccountName: { type: String },
  sAccountNumber: { type: String },
  approved: { type: Boolean, default: false },
  date: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model(
  "RequestConfirmation",
  requestConfirmationSchema
);
