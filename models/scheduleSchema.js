const mongoose = require("mongoose");

const schedulePatternSchema = new mongoose.Schema({
    Subject: {
      type: String
    },
    ColorName: {
      type: String
    },
    StartTime: String,
    EndTime:String,
    Id: Number

  });

const scheduleSchema = new mongoose.Schema({
    class:{type:String,unique:true},
    schedule:[schedulePatternSchema]
    });

const schedule = new mongoose.model("schedule",scheduleSchema);


module.exports = schedule;