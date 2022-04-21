require("dotenv").config();
const express = require("express");
const app = express();
const fs = require("fs");
const { default: mongoose } = require("mongoose");
const userRouter = require("./router/userRouter");

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
app.use(express.json());
app.use("/api/user", userRouter);

// D16SbQEFWNflGfMO
