const express = require("express");
require("./config/database");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validator.js");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth.js");
app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await userObj.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Login failed!!");
    }
    const passwordValidate = await user.getPasswordValid(password);

    if (passwordValidate) {
      const token = await user.getJwt();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });
      res.send("Login Successfull !!");
    } else {
      throw new Error("Login failed!!");
    }
  } catch (error) {
    res.status(400).send("Login Error " + error.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Profile Error " + error.message);
  }
});

app.post("/sendconnectionreq", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user.firstName + " sent connection request");
});

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
