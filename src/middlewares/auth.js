const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is not valid !!");
    }
    const userObj = await jwt.verify(token, "DevConnect");
    // console.log(userObj);

    const { _id } = userObj;
    const user = await User.findOne({ _id: _id });
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("Error in User Authentication " + error.message);
  }
};

module.exports = { userAuth };
