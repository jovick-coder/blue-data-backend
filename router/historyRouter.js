const historyRouter = require("express").Router();
const History = require("../model/historyModel");

historyRouter.get("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  // for user and resellers
  if (userPrivilege === 1 || 2) {
    try {
      const history = await History.find({ uId: userId });
      if (!history)
        return res
          .status(404)
          .send({ ok: false, message: "history not found" });
      return res.send({ ok: true, data: history });
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
      const history = await History.find();
      if (!history)
        return res
          .status(404)
          .send({ ok: false, message: "history not found" });
      res.send(res.locals);
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error + "." });
    }
    return;
  }
});

historyRouter.delete("/:id", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const id = req.params.id;
  // if params is * delete all
  if (id === "*") {
    try {
      const history = await History.deleteMany({ uId: userId });
      if (!history) {
        res.status(404).send({ ok: false, message: "history not found" });
        return;
      }
      return res.send({ ok: true, data: history });
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
    const history = await History.findOneAndDelete({ _id: id, uId: userId });
    if (!history)
      return res.status(404).send({ ok: false, message: "history not found" });
    res.send({ ok: true, data: history });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
});

module.exports = historyRouter;
