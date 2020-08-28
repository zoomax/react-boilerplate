const express = require("express");
const app = express();
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/test", {
  useNewUrlParser: true,
  useCreateIndex: false,
  useFindAndModify: true,
}).then(()=>{
    console.log("DB connected!")
});

app.get("/", (req, res, next) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log("app is listening on port 3000!");
});
