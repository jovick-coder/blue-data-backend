const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  aId: { type: String, required: true },
  message: { type: String, required: true },
  privilege: {
    type: Number,
    required: true,
  },
});
// const newLocal = "notification";
module.exports = mongoose.model("Notification", notificationSchema);
