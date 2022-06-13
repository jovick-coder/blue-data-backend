const buySubscription = require("express").Router();
const History = require("../model/historyModel");
const UserBank = require("../model/userAccountModel");
var axios = require("axios");
// const History = require("../model/historyModel");

buySubscription.post("/", async (req, res) => {
  const { userId, userPrivilege } = res.locals;
  const {
    Amount,
    Data_ID,
    Network,
    Number,
    Plan_type,
    Size,
    Validity,
    network_name,
  } = req.body;

  if (
    !Number ||
    !Network ||
    !Data_ID ||
    !Amount ||
    Number === "" ||
    Network === "" ||
    Data_ID === "" ||
    Amount === ""
  )
    return res.status(404).send({ ok: false, message: "Invalid Request" });

  // get user account details

  try {
    const oldAmount = await UserBank.findOne({
      uId: userId,
      privilege: userPrivilege,
    });
    // check if amount is sufficient for the request
    if (oldAmount.amount < Amount) {
      return res
        .status(400)
        .send({ ok: false, message: "Insufficient Balance" });
    }

    const requestBody = {
      network: Network,
      mobile_number: Number,
      plan: Data_ID,
      Ported_number: true,
    };

    let calculatedAmount;

    // var data = `${requestBody}`;

    var config = {
      method: "post",
      url: "https://www.gongozconcept.com/api/data/",
      headers: {
        Authorization: `Token ${process.env.GONGOZ_TOKEN}`,
        "Content-Type": "application/json",
      },
      data: requestBody,
    };

    axios(config)
      .then(async function (response) {
        // console.log(JSON.stringify(response.data));

        calculatedAmount = oldAmount.amount - Amount;
        UserBank.findOneAndUpdate(
          {
            uId: userId,
            privilege: userPrivilege,
          },
          { amount: calculatedAmount }
        ).exec();
        const newHistory = new History({
          uId: userId,
          amount: Amount,
          description: `Bought ${Plan_type} ${network_name} plan ${Size} @ ₦${Amount} to ${Number}, Validity: ${Validity}`,
          type: "-",
        });

        await newHistory.save();

        res.send({ ok: true });
      })
      .catch(function (error) {
        console.log("DATA_API --> ", error);
      });
  } catch (error) {
    console.log(error);
  }
});

module.exports = buySubscription;
