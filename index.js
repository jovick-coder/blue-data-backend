require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const userRouter = require("./router/userRouter");
const historyRouter = require("./router/historyRouter");
const userAccountRouter = require("./router/userAccountRouter");
const User = require("./model/userModel");

app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  fs.readFile("./public/doc.html", "utf8", function (err, html) {
    res.send(html);
  });
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      console.log(`Listening to port ${port}...`);
    });
  })
  .catch((err) => console.log("Error->", err));

async function authorization(req, res, next) {
  const token = req.headers.authorization;

  if (!token || token === "") {
    return res.status(401).send({ ok: false, message: "unAuthorized User" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const { uId, privilege } = decode;
    const user = await User.findOne({ _id: uId, privilege: privilege });
    if (!user)
      return respond(res, 404, {
        ok: false,
        message: "Authorized User Not Found",
      });

    res.locals.userId = uId;
    res.locals.userPrivilege = privilege;
    // res.send(decode);
    next();
  } catch (error) {
    res.send({ ok: false, message: "server error", error: error });
  }
}
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/history", authorization, historyRouter);
app.use("/api/account", authorization, userAccountRouter);

// D16SbQEFWNflGfMO
