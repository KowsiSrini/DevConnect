const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validator.js");
const bcrypt = require("bcrypt");
const User = require("../models/user");
authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout succesfull");
});

module.exports = { authRouter };
