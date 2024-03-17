const express = require('express');
const router = express.Router();
const Schedule = require('../models/scheduleSchema'); // Assuming your model file is in the same directory

// Create or update a record
router.post('/updateschedule', async (req, res) => {
    try {
        const { class: className, schedule } = req.body;
        // Find existing record
        let existingSchedule = await Schedule.findOne({ class: className });
        if (existingSchedule) {
            // Update existing record
            existingSchedule.schedule = schedule;
            await existingSchedule.save();
            return res.status(200).json(existingSchedule);
        }
        // Create new record
        const newSchedule = new Schedule({ class: className, schedule });
        await newSchedule.save();
        res.status(201).json(newSchedule);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get schedule by class
router.get('/getschedule/:class', async (req, res) => {
    try {
        const className = req.params.class;
        // Find schedule by class
        const schedule = await Schedule.findOne({ class: className });
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
