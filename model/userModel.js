const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  avatar: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
  userName: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  privilege: {
    type: Number,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});
module.exports = mongoose.model("User", userSchema);
