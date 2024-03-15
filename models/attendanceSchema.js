const mongoose = require("mongoose");

const classAttendanceSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    attendance: [{
        username: {
            type: String
        },
        present: {
            type: Boolean,
            default: false
        }
    }]
});

const ClassAttendance = mongoose.model("ClassAttendance", classAttendanceSchema);

module.exports = ClassAttendance;
