const express = require("express");
const app = express();

app.get("/user", (req, res) => {
  throw new Error("error");
  res.send("user data sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("something went wrong");
  }
});
app.listen(3000, () => {
  console.log("Server is successfully listening on port 4000");
});
