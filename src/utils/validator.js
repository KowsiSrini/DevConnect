const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Given Name is not valid!!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Given password is not strong!!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not correct");
  }
};

module.exports = { validateSignupData };
