const express = require("express");
const app = express();

app.use("/test", (req, res) => {
  res.send("Test route");
});

// app.get("/a(bc)+d", (req, res) => {
//   res.send("abc");
// });
// app.get("/a(bc)?d", (req, res) => {
//   res.send("abc");
// });
// app.get("/ab*cd", (req, res) => {
//   res.send("abc");
// });
//regex
app.get(/a/, (req, res) => {
  res.send("abc");
});

app.get(/.*fly$/, (req, res) => {
  res.send("abc");
});

// app.get("/user", (req, res) => {
//   console.log(req.query);

//   res.send("user data: kowsalya srinivasan");
// });

app.get("/user/:id/:name", (req, res) => {
  console.log(req.params);

  res.send("user data: kowsalya srinivasan");
});

app.post("/user", (req, res) => {
  res.send("user data saved successfully");
});

app.delete("/user", (req, res) => {
  res.send("user deleted successfully");
});

app.listen(3000, () => {
  console.log("Server is successfully listening on port 4000");
});
