const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value))
          throw new Error("Invalid Gender");
      },
    },
    skill: {
      type: [String],
    },
    about: {
      type: String,
      default: "Default about for the user",
    },
    photo: {
      type: String,

      validate(value) {
        if (!validator.isURL(value)) throw new Error("Invalid URL");
      },
    },
  },
  { timestamps: true }
);
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevConnect", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.getPasswordValid = async function (password) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(password, user.password);
  return isPasswordValid;
};

const User = mongoose.model("user", userSchema);
module.exports = User;
