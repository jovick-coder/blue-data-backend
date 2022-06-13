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

// const requestConfirmationHistorySchema = new mongoose.Schema({
//   // uId: { type: String, required: true },
//   description: { type: String },
//   amount: { type: Number, required: true },
//   type: { type: String, lim: 2 },
//   approved: { type: Boolean },
//   date: { type: Date, required: true, default: Date.now() },
// });

// module.exports = mongoose.model(
//   "RequestConfirmationHistory",
//   requestConfirmationHistorySchema
// );
