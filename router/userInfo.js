require("dotenv").config();
const userInfoRouter = require("express").Router();
const jwt = require("jsonwebtoken");
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");
const User = require("../model/userModel");
const UserBank = require("../model/userAccountModel");

function respond(res, statusCode, message) {
  res.status(statusCode).send(message);
}

userInfoRouter.get("/:id", async (req, res) => {
  const { userId, userPrivilege } = res.locals;

  const id = req.params.id;
  if (id === "") {
    res.status(400).send({ ok: false, message: "Invalid Parameter" });
    return;
  }
  // if params is * and user is admin or superAdmin list all users

  if (id === "1") {
    if (userPrivilege !== 3 && userPrivilege !== 4) {
      res.status(401).send({ ok: false, message: "UnAuthorized User " });
      return;
    }

    try {
      const user = await User.find({ privilege: 1 });
      if (!user) {
        res.status(404).send({ ok: false, message: "users not found" });
        return;
      }
      return res.send({ ok: true, data: user });
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
  }
  if (id === "2") {
    if (userPrivilege !== 3 && userPrivilege !== 4) {
      res.status(401).send({ ok: false, message: "UnAuthorized User " });
      return;
    }

    try {
      const user = await User.find({ privilege: 2 });
      if (!user) {
        res.status(404).send({ ok: false, message: "users not found" });
        return;
      }
      return res.send({ ok: true, data: user });
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
  }
  if (id === "3") {
    if (userPrivilege !== 3 && userPrivilege !== 4) {
      res.status(401).send({ ok: false, message: "UnAuthorized User " });
      return;
    }

    try {
      const user = await User.find({ privilege: 3 });
      if (!user) {
        res.status(404).send({ ok: false, message: "users not found" });
        return;
      }
      return res.send({ ok: true, data: user });
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
  }
  if (id === "4") {
    if (userPrivilege !== 3 && userPrivilege !== 4) {
      res.status(401).send({ ok: false, message: "UnAuthorized User " });
      return;
    }

    try {
      const user = await User.find({ privilege: 4 });
      if (!user) {
        res.status(404).send({ ok: false, message: "users not found" });
        return;
      }
      return res.send({ ok: true, data: user });
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
  }

  // Get a single user
  try {
    const user = await User.findOne({ _id: id });
    if (!user)
      return res.status(404).send({ ok: false, message: "user not found" });
    res.send({ ok: true, data: user });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
});

// userInfoRouter.put('/',(req,res)=>{

// })

module.exports = userInfoRouter;
