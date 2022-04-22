const mongoose = require("mongoose");

const userBankSchema = new mongoose.Schema({
  uId: { type: String, required: true },
  amount: { type: Number, required: true },
  privilege: {
    type: Number,
    required: true,
  },
});
// const newLocal = "UserBank";
module.exports = mongoose.model("UserBank", userBankSchema);
