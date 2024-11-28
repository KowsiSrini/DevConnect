const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionReq");
const userRouter = express.Router();

userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionReqModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    res.json({ message: "Data fetched succesfully", pendingRequests });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = { userRouter };
