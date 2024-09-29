const express = require("express");
const app = express();
const { adminauth } = require("./middlewares/auth");
app.use("/admin", adminauth);

app.get("/admin/getData", (req, res) => {
  res.send("Sent all data");
});

app.delete("/admin/deletedata", (req, res) => {
  res.send("data deleted succesfully");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 4000");
});
