const express = require('express');
const router = express.Router();
const ExaminationResult = require('../models/resultsSchema');

// POST API to add examination result
router.post('/examination-results', async (req, res) => {
    try {
        const { class: className, examinationId, students } = req.body;

        // Check if the class exists
        let existingResult = await ExaminationResult.findOne({ class: className, examinationId: examinationId });

        if (existingResult) {
            // Delete existing examination result
            await ExaminationResult.deleteOne({ _id: existingResult._id });

            // Create new examination result document
            const examinationResult = new ExaminationResult({ class: className, examinationId, students });
            const savedResult = await examinationResult.save();
            res.status(201).json(savedResult); // Respond with newly created examination result
        } else {
            // Create new examination result document
            const examinationResult = new ExaminationResult({ class: className, examinationId, students });
            const savedResult = await examinationResult.save();
            res.status(201).json(savedResult); // Respond with newly created examination result
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// GET API to get all examination results
router.get('/examination-results', async (req, res) => {
    try {
        const results = await ExaminationResult.find();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET API to get examination result by examination ID
router.get('/examination-results/:examinationId', async (req, res) => {
    try {
        const { examinationId } = req.params;
        const result = await ExaminationResult.find({ examinationId });
        if (!result) {
            return res.status(404).json({ message: 'Examination result not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET API to get all examination results of a class
router.get('/examination-results/class/:className', async (req, res) => {
    try {
        const { className } = req.params;
        const results = await ExaminationResult.find({ class: className });
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET API to get examination results of a student from a particular class
router.get('/examination-results/class/:className/students/:rollNumber', async (req, res) => {
    try {
        const { className, rollNumber } = req.params;
        const results = await ExaminationResult.find({ class: className, 'students.rollNumber': rollNumber });
        if (!results || results.length === 0) {
            return res.status(404).json({ message: 'Student not found in any instances of the class' });
        }
        const studentResults = results.map(result => ({
            examinationId: result.examinationId,
            studentResult: result.students.find(student => student.rollNumber === rollNumber)
        }));
        res.status(200).json(studentResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// GET API to search examination results by class and examination ID
router.get('/examination-results/search/:className/:examinationId', async (req, res) => {
    try {
        const { className, examinationId } = req.params;

        // Search for examination results based on class and examination ID
        const result = await ExaminationResult.findOne({ class: className, examinationId });
        if (!result) {
            return res.status(404).json({ message: 'Examination result not found' });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


module.exports = router;
