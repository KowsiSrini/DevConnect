const express = require("express");
require("./config/database");
const app = express();
const connectDB = require("./config/database");

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 4000");
    });
  })
  .catch((err) => {
    console.error("DB not connected", err);
  });
