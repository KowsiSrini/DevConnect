const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

connectionReqSchema.index({ fromUserId: 1, toUserId: 1 });
connectionReqSchema.pre("save", function (next) {
  const connectReq = this;
  if (connectReq.fromUserId.equals(connectReq.toUserId)) {
    throw new Error("Connection request to yourself is not possible !!");
  }
  next();
});

const ConnectionReqModel = new mongoose.model(
  "ConnectionRequest",
  connectionReqSchema
);

module.exports = ConnectionReqModel;
