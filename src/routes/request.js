const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth.js");
const ConnectionReq = require("../models/connectionReq.js");

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
module.exports = { requestRouter };
