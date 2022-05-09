require("dotenv").config();
const userRouter = require("express").Router();
const jwt = require("jsonwebtoken");
// const cloudinary = require("../utils/cloudinary");
// const upload = require("../utils/multer");
const User = require("../model/userModel");
const UserBank = require("../model/userAccountModel");

function respond(res, statusCode, message) {
  res.status(statusCode).send(message);
}

userRouter.post("/register", async (req, res) => {
  const { email, fullName, userName, phoneNumber, password, privilege } =
    req.body;
  if (!email || email === "")
    return respond(res, 400, {
      ok: false,
      message: "email is required",
    });
  if (!phoneNumber || phoneNumber === "")
    return respond(res, 400, {
      ok: false,
      message: "phoneNumber is required",
    });

  if (!password || password === "")
    return respond(res, 400, { ok: true, message: "password is required" });

  if (!privilege || privilege === "")
    return respond(res, 400, { ok: true, message: "privilege is required" });

  try {
    // Create new user
    let user = new User({
      email: email,
      fullName: fullName,
      userName: userName,
      phoneNumber: phoneNumber,
      password: password,
      privilege: privilege,
    });
    // Save user
    const newUser = await user.save();
    let bank = new UserBank({
      uId: newUser._id,
      amount: 0,
      privilege: newUser.privilege,
    });
    await bank.save();
    res.json({ ok: true });
  } catch (error) {
    return respond(res, 500, {
      ok: false,
      message: "Server error",
      error: error,
    });
  }
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || email === "")
    return respond(res, 400, {
      ok: false,
      message: "email is required",
    });

  if (!password || password === "")
    return respond(res, 400, { ok: false, message: "password is required" });

  try {
    const user = await User.findOne({ email: email, password: password });
    if (!user)
      return respond(res, 404, {
        ok: false,
        message: "User Not Found",
      });

    const token = jwt.sign(
      {
        uId: user._id,
        privilege: user.privilege,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ ok: true, token: token });
  } catch (error) {
    respond(res, 500, {
      ok: false,
      message: "Server Error",
      error: error,
    });
  }
});

// userRouter.get("/:id", async (req, res) => {
//   const { userId, userPrivilege } = res.locals;

//   const id = req.params.id;
//   // if params is * and user is admin or superAdmin list all users

//   if (id === "*") {
//     if (userPrivilege !== 3 && userPrivilege !== 4) {
//       res.status(401).send({ ok: false, message: "UnAuthorized User " });
//       return;
//     }

//     try {
//       const user = await User.find();
//       if (!user) {
//         res.status(404).send({ ok: false, message: "users not found" });
//         return;
//       }
//       return res.send({ ok: true, data: user });
//     } catch (error) {
//       res.send({ ok: false, message: "Server error", error: error + "." });
//     }
//   }

//   if (id === "") {
//     res.status(400).send({ ok: false, message: "Invalid Parameter" });
//     return;
//   }
//   // Get a single user
//   try {
//     const user = await User.findOne({ _id: id });
//     if (!user)
//       return res.status(404).send({ ok: false, message: "user not found" });
//     res.send({ ok: true, data: user });
//   } catch (error) {
//     res.send({ ok: false, message: "Server error", error: error + "." });
//   }
// });

module.exports = userRouter;
