const notificationRouter = require("express").Router();
const Notification = require("../model/notificationModel.js");
const User = require("../model/userModel.js");

notificationRouter.get("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  // for user and resellers
  if (userPrivilege === 1 || 2) {
    try {
      const notification = await Notification.find({ uId: userId });
      if (!notification)
        return res
          .status(404)
          .send({ ok: false, message: "notification not found" });
      return res.send({ ok: true, data: notification });
    } catch (error) {
      return res.send({
        ok: false,
        message: "Server error",
        error: error + ".",
      });
    }
  }
  // for admin and super admin
  if (userPrivilege === 3 || 4) {
    try {
      const notification = await Notification.find();
      if (!notification)
        return res
          .status(404)
          .send({ ok: false, message: "notification not found" });
      res.send(res.locals);
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
    return;
  }
});

notificationRouter.delete("/:id", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const id = req.params.id;
  // if params is * delete all
  if (id === "*") {
    try {
      const notification = await notification.deleteMany({ uId: userId });
      if (!notification) {
        res.status(404).send({ ok: false, message: "notification not found" });
        return;
      }
      return res.send({ ok: true, data: notification });
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
  }
  if (id === "") {
    res.send({ ok: false, message: "Invalid Parameter" });
    return;
  }
  // Delete one
  try {
    const notification = await Notification.findOneAndDelete({
      _id: id,
      uId: userId,
    });
    if (!notification)
      return res
        .status(404)
        .send({ ok: false, message: "notification not found" });
    res.send({ ok: true, data: notification });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
});

notificationRouter.post("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  let { message, category } = req.body;

  if (userPrivilege !== 3 && userPrivilege !== 4) {
    res.status(401).send({ ok: false, message: "UnAuthorized User " });
    return;
  }

  if (message === "") {
    res.status(400).send({ ok: false, message: "Message empty" });
    return;
  }
  if (!category || category === "") {
    category === 0;
  }

  // try {

  // } catch (error) {
  //   return res.status(500).send({
  //     ok: false,
  //     message: "Error Finding Admins name",
  //     error: error,
  //   });
  // }
  try {
    const user = await User.findOne({ _id: userId, privilege: userPrivilege });
    if (!user)
      return res.status(404).send({
        ok: false,
        message: "Admin Not Found",
      });
    const notification = new Notification({
      adminName: user.userName,
      message: req.body.message,
      privilege: userPrivilege,
      category: category,
    });
    // const notification =
    await notification.save();

    res.status(200).send({ ok: true });
  } catch (error) {
    res
      .status(500)
      .send({ ok: false, message: "Server Error", error: error + "." });
  }
});

module.exports = notificationRouter;
