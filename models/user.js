const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    let password = await bcrypt.hash(this.password, 8);
    if (password) {
      this.password = password;
      next();
    } else {
      next(password);
    }
  } else {
    next();
  }
});

UserSchema.methods.comparePasswords = async function (password, cb) {
  console.log(password);
  try {
    let isMatch = await bcrypt.compare(password, this.password);
    console.log(isMatch);
    console.log(this.password);
    return cb(null, isMatch);
  } catch (err) {
    return cb(err);
  }
};

UserSchema.methods.generateToken = async function (cb) {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    this.token = token;
    await this.save();
    return cb(null, { token });
  } catch (err) {
    return cb(err);
  }
};

UserSchema.statics.findByToken = async function (token, cb) {
    let user = this;
    let { _id } = jwt.verify(token, process.env.JWT_SECRET);
    console.log("id" , _id) ;
    try {
      const targetUser = await user.findOne({
        _id,
        token,
      });
      if (targetUser) return cb(null, targetUser);
    } catch (err) {
      return cb(err);
    }
  }

const UserModel = mongoose.model("users", UserSchema);

module.exports = {
  UserModel,
};
