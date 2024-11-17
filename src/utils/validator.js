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

const validateEditProfile = (req) => {
  const allowedEditFields = ["age", "gender", "about", "skill", "photo"];

  const isEditValid = Object.keys(req.body).every((key) =>
    allowedEditFields.includes(key)
  );

  return isEditValid;
};

const validatePwdField = (req) => {
  const pwdFields = ["oldpassword", "newpassword"];

  let isPwdChange = true;

  const missingFields = pwdFields.filter((field) => !(field in req.body));
  if (missingFields.length > 0) {
    isPwdChange = false;
  }
  return isPwdChange;
};
module.exports = { validateSignupData, validateEditProfile, validatePwdField };
