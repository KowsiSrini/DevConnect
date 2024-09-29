const express = require("express");
const app = express();

app.use("/admin", (req, res, next) => {
  const token = "xyzmmmm";
  const isAuth = token === "xyz";
  if (!isAuth) {
    res.status(401).send("not an admin request");
  } else {
    next();
  }
});

app.get("/admin/getData", (req, res) => {
  res.send("Sent all data");
});

app.delete("/admin/deletedata", (req, res) => {
  res.send("data deleted succesfully");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 4000");
});
