const userAccountRouter = require("express").Router();
const History = require("../model/historyModel");
const UserBank = require("../model/userAccountModel");

userAccountRouter.post("/", (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const amount = req.body.amount;
  if (!amount || amount === "")
    return res.status(400).send({ ok: false, message: "Amount is required" });

  const newAmount = req.body.amount;

  UserBank.findOne({ uId: userId, privilege: userPrivilege })
    .update({ amount: newAmount })
    .exec();

  res.send({ ok: true });
});

userAccountRouter.get("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;

  try {
    const user = await UserBank.findOne({
      uId: userId,
      privilege: userPrivilege,
    });
    if (!user)
      return res.status(404).send({
        ok: false,
        message: " User Account Not Found",
      });

    res.send({ ok: true, data: user });
  } catch (error) {
    return res.status(500).send({
      ok: false,
      message: " Server error",
      error: error,
    });
  }
});
module.exports = userAccountRouter;
