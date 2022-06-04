const userAccountRouter = require("express").Router();
const History = require("../model/historyModel");
const UserBank = require("../model/userAccountModel");

userAccountRouter.put("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const amount = req.body.amount;
  const method = req.body.method;
  const userAccountId = req.body.userId;
  if (!amount || amount === "")
    return res.status(400).send({ ok: false, message: "Amount is required" });
  if (!method || method === "")
    return res.status(400).send({ ok: false, message: "Method is required" });
  if (method !== "+" && method !== "-")
    return res
      .status(400)
      .send({ ok: false, message: "Invalid Method " + method });
  if (userPrivilege < 4)
    return res.status(401).send({ ok: false, message: "UnAuthorized Request" });

  const newAmount = req.body.amount;
  try {
    const oldAmount = await UserBank.findOne({
      uId: userAccountId,
    });

    if (!oldAmount) {
      return res.status(404).send({ ok: false, message: "Invalid User ID" });
    }

    const { amount } = oldAmount;

    let calculatedAmount;

    if (method === "+") {
      calculatedAmount = amount + newAmount;
    }
    if (method === "-") {
      if (amount < newAmount) {
        return res
          .status(400)
          .send({ ok: false, message: "Insufficient Balance" });
      }
      calculatedAmount = amount - newAmount;
    }
    UserBank.findOneAndUpdate(
      {
        uId: userAccountId,
      },
      { amount: calculatedAmount }
    ).exec();

    const newHistory = new History({
      uId: userAccountId,
      amount: newAmount,
      description: `Account has Been Credited with ${newAmount}, \n New Balance is ${calculatedAmount} \n Thanks, \n Admin.`,
      type: method,
    });
    await newHistory.save();
    res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
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
