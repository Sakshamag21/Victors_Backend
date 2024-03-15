const mongoose = require('mongoose');

// Define schema for subject
const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  resources: [{
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  }]
});

// Define schema for class
const classSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true
  },
  subjects: [subjectSchema]
});

// Create models
const Class = mongoose.model('Class', classSchema);
const Subject = mongoose.model('Subject', subjectSchema);

module.exports = {
  Class,
  Subject
};
