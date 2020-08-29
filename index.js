const express = require("express");
const app = express();
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const cookie_parser = require("cookie-parser");
const dotenv = require("dotenv")
dotenv.config() ;
const {UserModel} = require("./models/user") ; 
mongoose
  .connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    createIndexes : true 
  })
  .then(() => {
    console.log("DB connected!");
  })
  .catch((error) => console.error(error));

app.use(
  body_parser.urlencoded({
    extended: true,
  })
);
app.use(body_parser.json());
app.use(cookie_parser());
app.get("/", (req, res, next) => {
  res.send("hello world");
});


app.post("/api/users/register" , async (req , res , next)=>{
 const user  = await new UserModel(req.body).save().then(data => { 
  if(data) { 
    res.status(200).json({
      success : true ,  
      data 
    })
  }
 }).catch(error=>{
  res.status(400).json( { 
    success : false  , 
    error  , 
    errMessage : error.message  
  })
 })  ; 
  
})

app.listen(process.env.PORT, () => {
  console.log("app is listening on port 3000!");
});
