const mongoose = require("mongoose");
const { required } = require("nodemon/lib/config");
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
});
module.exports = mongoose.model("User", userSchema);
