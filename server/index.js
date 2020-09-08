const express = require("express");
const app = express();
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const cookie_parser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();
const { UserModel } = require("./models/user");
const { auth } = require("./utils/auth");
const  port  = process.env.port || 3000  ; 
mongoose
  .connect(process.env.MONGOOSE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected!");
  })
  .catch((error) => console.error(error));

  app.use(express.static("public"))
app.use(
  body_parser.urlencoded({
    extended: true,
  })
);
app.use(body_parser.json());
app.use(cookie_parser());
app.get("/", (req, res, next) => {
  res.json({
    message  : "hello world"
  });
});
app.get("/api/users/auth", auth, async function (req, res) {
  res.status(200).json({
    isAuth: true,
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});
app.post("/api/users/register", async (req, res, next) => {
  const user = await new UserModel(req.body)
    .save()
    .then((data) => {
      if (data) {
        res.status(200).json({
          success: true,
          data,
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        success: false,
        error,
        errMessage: error.message,
      });
    });
});
app.post("/api/users/login", async (req, res, next) => {
  let { email, password } = req.body;
  console.log(password);
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      const isCorrect = await user.comparePasswords(password, function (
        err,
        isMatch
      ) {
        if (err) {
          return res.status(403).json({
            loginSuccess: false,
            message: err.message,
          });
        } else {
          return isMatch;
        }
      });
      console.log("iscorrect", isCorrect);
      if (isCorrect) {
        await user.generateToken((err, payload) => {
          if (err) return res.status(400);
          else {
            return res.cookie("X_auth", payload).status(200).json({
              loginSuccess: true,
              payload,
            });
          }
        });
      } else {
        res.status(403).json({
          loginSuccess: false,
          message: "Unauthorized , username not correct",
        });
      }
    } else {
      res.status(403).json({
        loginSuccess: false,
        message: "Unauthorized , username not correct",
      });
    }
  } catch (err) {
    res.status(400).json({
      loginSuccess: false,
      error: err.message,
    });
  }
});
app.get("/api/users/logout", auth , async function (req, res) {
  try {
    console.log(req.user) ; 
    const user = UserModel.findOneAndUpdate(
      { _id: req.user._id },
      { token: "" },
      { new: true }
    );
    if (user) {
      res.clearCookie("X_auth") ; 
      delete req.user  ; 
      delete req.token  ; 
      res.status(200).json({
        logout: true,
        message: "Logged out",
      });
    }
  } catch (err) {
    res.status(400).json( { 
      error :true ,
      message : err.message  , 
    })
  }
});
app.listen(port, () => {
  console.log(`App is listening on port ${port} !`);
});

