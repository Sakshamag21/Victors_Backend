const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");



router.get("/",(req,res)=>{
    console.log("connect");
});

// Route to create a new user
router.post('/register', async (req, res) => {
    try {
      // Check if the email already exists
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(401).send({ error: 'Email already exists' });
      }

      const existingUsername = await User.findOne({ username: req.body.username });
      if (existingUsername) {
        return res.status(402).send({ error: 'UserName already exists' });
      }
  
      // Create the user
      const user = new User(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
});

// Route to get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

// Route to find user with name and password
router.post("/login", async (req, res) => {
    const { name, password } = req.body;
    try {
      const user = await User.findOne({ name, password });
      if (!user) {
        return res.status(404).json({ msg: "Invalid credentials" });
      }
    //   const token = jwt.sign({ id: user.id }, jwtPassword);
      res.status(200).json({
        name: user.name,
        role: user.role,
        id: user.id,
      });
    } catch (error) {
      res.status(500).json({ msg: "Server error" });
    }
  });

// Route to get user by ID
router.get('/users/id/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findOne({id:id});
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

// Route to get user by class
router.get('/users/class/:class', async (req, res) => {
    const userClass = req.params.class;
    try {
        const users = await User.find({ class: userClass, role:"student" });
        res.send(users);
    } catch (error) {
        res.status(500).send();
    }    
});

// Route to get user by role
router.get('/users/role/:role', async (req, res) => {
    const userRole = req.params.role;
    try {
      const users = await User.find({ role: userRole });
      res.send(users);
    } catch (error) {
      res.status(500).send();
    }
});


// Route to update a user by ID
router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'name', 'class', 'mobile', 'password', 'id', 'role'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route to delete a user by ID
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});


router.get('/users/password/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });
    console.log(user)
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Return only the password field for security reasons
    res.json({ password: user.password, email: user.email , name: user.name});
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;










