const express = require("express");
require("./config/database");
const app = express();
const connectDB = require("./config/database");
const cookieparser = require("cookie-parser");

const { authRouter } = require("./routes/auth.js");
const { profileRouter } = require("./routes/profile.js");
const { requestRouter } = require("./routes/request.js");

app.use(express.json());
app.use(cookieparser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB not connected", err);
  });
