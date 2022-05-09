const { default: mongoose } = require("mongoose");

const historySchema = new mongoose.Schema({
  uId: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  type: { type: String, lim: 2 },
  read: { type: Boolean, default: false },
  date: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model("History", historySchema);
