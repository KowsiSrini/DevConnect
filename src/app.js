const express = require("express");
const app = express();
const { adminauth, userAuth } = require("./middlewares/auth");
app.use("/admin", adminauth);

app.get("/admin/getData", (req, res) => {
  res.send("Sent all data");
});

app.delete("/admin/deletedata", (req, res) => {
  res.send("data deleted succesfully");
});

app.get("/user", userAuth, (req, res) => {
  res.send("user data sent");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 4000");
});
