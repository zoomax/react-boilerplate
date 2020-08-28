const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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


const UserModel = mongoose.model("users" , UserSchema) ; 

module.exports = { 
    UserModel
}