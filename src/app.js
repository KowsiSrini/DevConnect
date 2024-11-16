const express = require("express");
require("./config/database");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
app.use(express.json());
app.post("/signup", async (req, res) => {
  console.log(req.body);

  const userObj = new User(req.body);
  try {
    await userObj.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user ", err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });
    if (user.length === 0) {
      res.status(400).send("User not Found");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userid;
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch (error) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
  try {
    const userId = req.body.userID;
    const data = req.body;
    const user = await User.findByIdAndUpdate(userId, data);
    console.log(user);
    res.send("User Updated");
  } catch (error) {
    res.status(400).send("Something went wrong");
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
