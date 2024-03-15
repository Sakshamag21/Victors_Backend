const express = require('express');
const router = express.Router();
const ClassAttendance = require('../models/attendanceSchema'); // Assuming your model file is in the same directory

// Route to create class attendance
router.post('/attendance', async (req, res) => {
  try {
    console.log(req.body)
    const attendance = new ClassAttendance(req.body);
    await attendance.save();
    res.status(201).send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to get class attendance by class and date
router.get('/attendance/:class/:date', async (req, res) => {
  const { class: className, date } = req.params;
  console.log(className,date)

  try {
    const attendance = await ClassAttendance.findOne({ class: className, date });
    if (!attendance) {
      return res.status(404).send({ error: 'Attendance not found' });
    }
    res.send(attendance);
  } catch (error) {
    res.status(500).send();
  }
});

// Route to update class attendance by class and date
router.patch('/attendance/:class/:date', async (req, res) => {
  const { class: className, date } = req.params;

  try {
    const attendance = await ClassAttendance.findOneAndUpdate({ class: className, date }, req.body, { new: true });
    if (!attendance) {
      return res.status(404).send({ error: 'Attendance not found' });
    }
    res.send(attendance);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to delete class attendance by class and date
router.delete('/attendance/:class/:date', async (req, res) => {
  const { class: className, date } = req.params;

  try {
    const attendance = await ClassAttendance.findOneAndDelete({ class: className, date });
    if (!attendance) {
      return res.status(404).send({ error: 'Attendance not found' });
    }
    res.send(attendance);
  } catch (error) {
    res.status(500).send();
  }
});


// Route to get attendance by class and username
router.get('/userattendance/:class/:username', async (req, res) => {
    const { class: className, username } = req.params;
  
    try {
      const attendances = await ClassAttendance.find({ class: className, 'attendance.username': username });
      if (!attendances || attendances.length === 0) {
        return res.status(404).send({ error: 'Attendance not found' });
      }
      
      // Filter attendance records for the specific username
      const userAttendances = attendances.map(attendance => {
        const userAttendance = attendance.attendance.find(entry => entry.username === username);
        return { date: attendance.date, userAttendance };
      });
  
      res.send(userAttendances);
    } catch (error) {
      res.status(500).send();
    }
});

// Route to get attendance by class spanned over a period of one month
router.get('/attendance/:class', async (req, res) => {
    const { class: className } = req.params;
  
    try {
      const attendance = await ClassAttendance.find({ class: className });
  
      if (!attendance || attendance.length === 0) {
        return res.status(404).send({ error: 'Attendance not found' });
      }
  
      res.send(attendance);
    } catch (error) {
      res.status(500).send();
    }
});
  
module.exports = router;
