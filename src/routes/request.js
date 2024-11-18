const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionReq = require("../models/connectionReq.js");
const User = require("../models/user.js");
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatuses = ["ignored", "interested"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).send({ message: `Invalid Status: ${status}` });
      }
      const userExists = await User.findById(toUserId);
      if (!userExists) {
        return res.status(400).send({ message: "User not found" });
      }
      const existsConnection = await ConnectionReq.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existsConnection) {
        return res
          .status(400)
          .send({ message: "Connection request already exists" });
      }
      const connectRequest = new ConnectionReq({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectRequest.save();
      res.send({ message: "Connection request sent successfully!!", data });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params.status;
      const requestId = req.params.requestId;

      const acceptableStatus = ["accepted", "rejected"];
      if (!acceptableStatus.includes(status)) {
        return res.status(404).json({ message: "Invalid Status " + status });
      }
      console.log({ requestId });
      console.log(loggedInUser._id);
      console.log(status);
      const requestExists = await ConnectionReq.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!requestExists) {
        return res.status(404).json("Request Id not found");
      }
      requestExists.status = status;
      const data = await requestExists.save();
      res.status(200).json({ message: "Connection Request " + status, data });
    } catch (error) {
      res.status(400).send("Error : " + error.message);
    }
  }
);
module.exports = { requestRouter };
