const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  adminName: { type: String, required: true },
  message: { type: String, required: true },
  privilege: {
    type: Number,
    required: true,
  },
  date: { type: Date, required: true, default: Date.now() },
  category: { type: Number, required: true },
  seen: { type: Boolean, required: true, default: false },
});
// const newLocal = "notification";
module.exports = mongoose.model("Notification", notificationSchema);
