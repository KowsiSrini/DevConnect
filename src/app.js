const express = require("express");
require("./config/database");
const app = express();
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData } = require("./utils/validator.js");
const bcrypt = require("bcrypt");
const cookieparser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieparser());

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    validateSignupData(req);
    const passwordHash = await bcrypt.hash(password, 10);
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await userObj.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("Error saving the user " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Login failed!!");
    }
    const passwordValidate = await bcrypt.compare(password, user.password);
    if (passwordValidate) {
      const token = jwt.sign({ _id: user._id }, "DevConnect");

      res.cookie("token", token);
      res.send("Login Successfull !!");
    } else {
      throw new Error("Login failed!!");
    }
  } catch (error) {
    res.status(400).send("Login Error " + error.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookie = req.cookies;
    const { token } = cookie;
    if (!token) {
      throw new Error("Token is invalid");
    }
    const validateCookie = jwt.verify(token, "DevConnect");
    // console.log(validateCookie);
    const user = await User.findOne({ _id: validateCookie._id });
    if (!user) {
      throw new Error("User not found");
    }
    // console.log(user);

    res.send(user);
  } catch (error) {
    res.status(400).send("Profile Error " + error.message);
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

app.patch("/user/:userID", async (req, res) => {
  try {
    const data = req.body;
    const ALLOWED_UPDATES = [
      "userID",
      "lastName",
      "age",
      "gender",
      "about",
      "skill",
      "photo",
    ];
    const allowUpdate = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    console.log({ allowUpdate });

    if (!allowUpdate) {
      throw new Error("Update not allowed");
    }

    if (data.skill.length > 20) {
      throw new Error("Skill set length exceeds");
    }

    const userId = req.params?.userID;

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    console.log(user);
    res.send("User Updated");
  } catch (error) {
    res.status(400).send("Something went wrong " + error.message);
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
