const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email:{type:String, unique:true},
    name:String,
    class:String,
    mobile:String,
    password: String,
    id: {type:String, unique:true},
    role: {
      type: String,
      enum: ["student", "teacher", "director"],
    },
  });

const users = new mongoose.model("users",userSchema);


module.exports = users;