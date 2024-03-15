const express = require("express");
const router = express.Router();
const {Class,Subject} = require("../models/resourcesSchema");



router.get("/",(req,res)=>{
    console.log("connect");
});

// POST API to add data
router.post('/classes/:className/subjects', async (req, res) => {
    try {
      const { className } = req.params;
      const { name, resources } = req.body;
  
      const subject = new Subject({ name, resources });
      const updatedClass = await Class.findOneAndUpdate(
        { className },
        { $push: { subjects: subject } },
        { new: true, upsert: true }
      );
  
      res.status(201).json(updatedClass);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  // GET API to retrieve data
  router.get('/classes/:className/subjects', async (req, res) => {
    try {
      const { className } = req.params;
      const classData = await Class.findOne({ className });
      console.log("in")
      if (!classData) {
        return res.status(404).json({ message: 'Class not found' });
      }
  
      res.status(200).json(classData.subjects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



module.exports = router;










