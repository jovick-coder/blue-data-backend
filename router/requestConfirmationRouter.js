const requestConfirmation = require("express").Router();
const RequestConfirmation = require("../model/requestConfirmationModel");
const RequestConfirmationHistory = require("../model/historyModel");
const Notification = require("../model/notificationModel.js");

requestConfirmation.post("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;

  const { uId, amount, sAccountName, sAccountNumber, sName, rBankName } =
    req.body;

  if (
    !uId ||
    !amount ||
    !sAccountName ||
    !sAccountNumber ||
    !sName ||
    !rBankName ||
    uId === "" ||
    amount === "" ||
    sAccountName === "" ||
    sAccountNumber === "" ||
    sName === "" ||
    rBankName === ""
  ) {
    return res.status(400).send({ ok: false, message: "Invalid Request" });
  }
  // console.log(req.body);

  try {
    const requestConfirmation = new RequestConfirmation({
      uId: uId,
      amount: amount,
      sName: sName,
      rBankName: rBankName,
      sAccountName: sAccountName,
      sAccountNumber: sAccountNumber,
    });
    console.log(requestConfirmation);
    await requestConfirmation.save();

    const notification = new Notification({
      adminName: "request bolt",
      adminPrivilege: "4",
      message: `Request for Confirmation ${amount}, from ${sAccountNumber},${sAccountName} sent to ${rBankName}. Approve ${uId} request if request is Confirmed`,
      privilege: "4",
      category: "Super Admin",
    });
    // const notification =
    await notification.save();
    res.status(200).send({ ok: true });
  } catch (error) {
    // console.log(error);
    return res.send({ ok: false, message: "Server error", error: error + "." });
  }
});

requestConfirmation.get("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  // for admin and super admin
  if (userPrivilege !== 3 && userPrivilege !== 4)
    return res.status(401).send({ ok: false, message: "Unauthorized User" });

  try {
    const requestConfirmation = await RequestConfirmation.find();
    if (!requestConfirmation)
      return res
        .status(404)
        .send({ ok: false, message: "request Confirmation not found" });
    return res.send({ ok: true, data: requestConfirmation });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
  return;
});

requestConfirmation.put("/:id", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const id = req.params.id;
  const { uId, amount, sAccountName, sAccountNumber, sName, rBankName } =
    req.body;
  // for admin and super admin
  if (userPrivilege !== 3 && userPrivilege !== 4)
    return res.status(401).send({ ok: false, message: "Unauthorized User" });

  try {
    // console.log(id);
    var query = { _id: id, approved: false };
    const response = await RequestConfirmation.findOneAndUpdate(query, {
      approved: true,
    });
    if (!response)
      return res.status(404).send({ ok: false, message: "request not found" });

    // const newRequestConfirmationHistory = new RequestConfirmationHistory({
    //   uId: uId,
    //   description: `${amount} was approved by Super Admin from ${sAccountName} - ${sAccountNumber} sent to ${rBankName}.`,
    //   amount: amount,
    //   type: "+",
    //   approved: true,
    // });

    // await newRequestConfirmationHistory.save();

    const newHistory = new History({
      uId: uId,
      amount: amount,
      description: `Your request for confirmation has been approved ${amount} founded, by admin`,
      type: "+",
    });
    await newHistory.save();

    return res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
  return;
});
requestConfirmation.delete("/:id&:uId", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const id = req.params.id;
  const uId = req.params.uId;

  // const { amount, sAccountName, sAccountNumber, sName, rBankName } = req.body;
  // for admin and super admin
  if (userPrivilege !== 3 && userPrivilege !== 4)
    return res.status(401).send({ ok: false, message: "Unauthorized User" });

  if (!uId || (!id && uId === "") || id === "") {
    return res.status(400).send({ ok: false, message: "Invalid request" });
  }
  try {
    // console.log(id);
    var query = { _id: id, approved: false };
    const response = await RequestConfirmation.findOneAndDelete(query, {
      approved: true,
    });
    if (!response)
      return res.status(404).send({ ok: false, message: "request not found" });

    // const newRequestConfirmationHistory = new RequestConfirmationHistory({
    //   description: `${uId} Request was Deleted by Super Admin.`,
    //   amount: 0,
    //   type: "-",
    //   approved: true,
    // });

    const notification = new Notification({
      adminName: "request bolt",
      adminPrivilege: "4",
      message: `Your request for confirmation was not approved, contact admin directly to find out the reason. `,
      privilege: uId,
      category: "Single User",
    });
    await notification.save();
    // await newRequestConfirmationHistory.save();

    return res.send({ ok: true });
  } catch (error) {
    res.send({ ok: false, message: "Server error", error: error + "." });
  }
  return;
});

module.exports = requestConfirmation;
