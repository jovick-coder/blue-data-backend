const historyRouter = require("express").Router();
const History = require("../model/historyModel");

historyRouter.get("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  // for user and resellers
  if (userPrivilege === 1 || 2) {
    try {
      const history = await History.find({ uId: userId });
      if (!history) return res.status(404).send("history not found");
      return res.send({ ok: true, data: history });
    } catch (error) {
      return res.send({ ok: false, message: "Server error", error: error });
    }
  }
  // for admin and super admin
  if (userPrivilege === 3 || 4) {
    try {
      const history = await History.find();
      if (!history) return res.status(404).send("history not found");
      res.send(res.locals);
    } catch (error) {
      res.send({ ok: false, message: "Server error", error: error });
    }
    return;
  }
});

module.exports = historyRouter;
