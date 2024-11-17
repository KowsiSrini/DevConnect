const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const bcrypt = require("bcrypt");
const {
  validateEditProfile,
  validatePwdField,
} = require("../utils/validator.js");
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("Profile Error " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    console.log(req.body);

    console.log({ loggedInUser });

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your data updated successfully !`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error " + error);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    if (!validatePwdField(req)) {
      throw new Error("Enter old password and new password");
    }
    const loggedInUser = req.user;
    const enteredOldPwd = req.body.oldpassword;
    const enteredNewPwd = req.body.newpassword;
    const isoldpwdMatches = await loggedInUser.getPasswordValid(enteredOldPwd);
    console.log({ isoldpwdMatches });
    if (isoldpwdMatches) {
      const newPasswordHash = await bcrypt.hash(enteredNewPwd, 10);
      loggedInUser.password = newPasswordHash;
      loggedInUser.save();
    } else {
      throw new Error("Current password is not correct");
    }

    res.send("password changed scucessfully");
  } catch (error) {
    res.status(400).send("Error " + error.message);
  }
});
module.exports = { profileRouter };
