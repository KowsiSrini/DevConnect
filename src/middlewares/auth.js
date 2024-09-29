const adminauth = (req, res, next) => {
  const token = "xyz";
  const isAuth = token === "xyz";
  if (!isAuth) {
    res.status(401).send("not an admin request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuth = token === "xyz";
  if (!isAuth) {
    res.status(401).send("not an admin request");
  } else {
    next();
  }
};

module.exports = { adminauth, userAuth };
