const express = require("express");
require("./config/database");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
app.post("/signup", async (req, res) => {
  const userObj = new User({
    firstName: "Kowsalya",
    lastName: "Srinivasan",
    emailId: "kowsisrini25@gmail.com",
    password: "kowsi@123",
  });
  try {
    await userObj.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user ", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("DB not connected", err);
  });
