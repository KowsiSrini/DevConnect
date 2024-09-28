const express = require("express");
const app = express();
// route handler can be wrapped in array
//app.use("/user",[h1,h2,h3,h4,h5])
// app.use("/user",[h1,h2],h3,h4,h5)
app.use(
  "/user",
  (req, res, next) => {
    res.send("user 1");
    next();
  },
  (req, res) => {
    res.send("user 2");
  }
);

app.listen(3000, () => {
  console.log("Server is successfully listening on port 4000");
});
