const mongoose = require("mongoose");

const connectDB = async function () {
  await mongoose.connect("mongodb://127.0.0.1:27017/devConnect", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
