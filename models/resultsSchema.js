const mongoose = require('mongoose');

const subjectMarksSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  }
});

const studentResultSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true
  },
  subjects: [subjectMarksSchema]
});

const examinationResultSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  examinationId: {
    type: String,
    required: true
  },
  students: [studentResultSchema]
});

const ExaminationResult = mongoose.model('ExaminationResult', examinationResultSchema);

module.exports = ExaminationResult;
