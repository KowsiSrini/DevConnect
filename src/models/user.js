const mongoose = require("mongoose");
const validator = require("validator");
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
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Incorrect Email format");
      },
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
      default: "photourl",
      validate(value) {
        if (!validator.isURL(value)) throw new Error("Invalid URL");
      },
    },
  },
  { timestamps: true }
);
const User = mongoose.model("user", userSchema);
module.exports = User;
