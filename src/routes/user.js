const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionReqModel = require("../models/connectionReq");
const userRouter = express.Router();
const SAFE_USER_DATA = "firstName lastName skill about";
const User = require("../models/user.js");
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await ConnectionReqModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);
    res.json({ message: "Data fetched succesfully", pendingRequests });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionReq = await ConnectionReqModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);
    console.log(connectionReq);

    const data = connectionReq.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId;
      return row.fromUserId;
    });
    res.send({ data });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;
    const connectionReq = await ConnectionReqModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // console.log(connectionReq);

    const hideUsersFromFeed = new Set();
    connectionReq.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    // console.log(hideUsersFromFeed);
    // console.log(limit);
    // console.log(skip);

    const feedUser = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(SAFE_USER_DATA)
      .skip(skip)
      .limit(limit);
    res.send(feedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = { userRouter };
