const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = "123456";
const express = require("express");
const zod = require("zod");
const app = express();

// Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/your-database-name", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const userSchema = new mongoose.Schema({
//     name: String,
//     password: String,
//     id: String,
//   });

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  id: String,
  role: {
    type: String,
    enum: ["student", "teacher", "director"],
  },
});

// Create a Mongoose model based on the schema
const User = mongoose.model("User", userSchema);

const schema = zod
  .object({
    name: zod.string().regex(/^[a-zA-Z]+$/),
    password: zod.string().max(9),
    id: zod.string(),
    role: {
      type: String,
      enum: ["student", "teacher", "director"],
    },
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch) => /[A-Z]/.test(ch);
    const containsLowercase = (ch) => /[a-z]/.test(ch);

    let countOfUpperCase = 0,
      countOfLowerCase = 0,
      countOfNumbers = 0;

    for (let i = 0; i < password.length; i++) {
      let ch = password.charAt(i);
      if (!isNaN(+ch)) countOfNumbers++;
      else if (containsUppercase(ch)) countOfUpperCase++;
      else if (containsLowercase(ch)) countOfLowerCase++;
    }

    if (countOfLowerCase < 1 || countOfUpperCase < 1 || countOfNumbers < 1) {
      checkPassComplexity.addIssue({
        message: "password does not meet complexity requirements",
      });
    }
  });

app.use(express.json());

pp.post("/register", async (req, res) => {
  const input = req.body;

  // Validate if the required fields are present
  if (
    !input.hasOwnProperty("name") ||
    !input.hasOwnProperty("password") ||
    !input.hasOwnProperty("role")
  ) {
    res.status(411).json({
      msg: "Invalid Inputs",
      errors: [
        "At least one of the required fields (name, password, role) is missing",
      ],
    });
    return;
  }

  // Validate input against the Zod schema
  const result = schema.safeParse(input);

  // Check if validation failed
  if (!result.success) {
    res.status(411).json({
      msg: "Invalid Inputs",
      errors: result.error.errors,
    });
    return;
  }

  try {
    // Generate unique ID
    const id = generateUniqueId();

    // Create a new user instance with unique ID and chosen role
    const newUser = new User({
      name: input.name,
      password: input.password,
      role: input.role,
      id: id,
    });

    // Save the user to the database
    await newUser.save();

    res.status(200).json({
      msg: "User created successfully",
      data: { id: id },
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error creating user",
      error: error.message,
    });
  }
});

// app.post("/register-user", async (req, res) => {
//   const input = req.body;

//   // Validate if the required fields are present
//   if (!input.hasOwnProperty("name") || !input.hasOwnProperty("password") || !input.hasOwnProperty("id")) {
//     res.status(411).json({
//       msg: "Invalid Inputs",
//       errors: ["At least one of the required fields (name, password, id) is missing"]
//     });
//     return;
//   }

//   // Validate input against the Zod schema
//   const result = schema.safeParse(input);

//   // Check if validation failed
//   if (!result.success) {
//     res.status(411).json({
//       msg: "Invalid Inputs",
//       errors: result.error.errors
//     });
//     return;
//   }

//   try {
//     // Create a new user instance
//     const newUser = new User({
//       name: input.name,
//       password: input.password,
//       id: input.id,
//     });
//     // Save the user to the database
//     await newUser.save();
//     res.status(200).json({
//       msg: "User created successfully",
//       data: newUser
//     });
//   } catch (error) {
//     res.status(500).json({
//       msg: "Error creating user",
//       error: error.message
//     });
//   }
// });

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  try {
    // Find user by name and password
    const user = await User.findOne({ name, password });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ msg: "Invalid credentials" });
    }

    // User authentication successful, generate token
    const token = jwt.sign({ id: user.id }, jwtPassword);

    // Respond with user details and token
    res.status(200).json({
      token,
      name: user.name,
      role: user.role,
      id: user.id,
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Change Password after Login
app.post("/change-password", async (req, res) => {
  const { name, token, currentPassword, newPassword } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwtPassword);
    if (!decoded || decoded.id !== name) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Find user by name and current password
    const user = await User.findOne({ name, password: currentPassword });

    // Check if user exists and password matches
    if (!user) {
      return res.status(404).json({ msg: "Invalid credentials" });
    }

    // Update user's password with new password
    user.password = newPassword;
    await user.save();

    // Record response
    const response = new Response({
      userId: user.id,
      response: "Password changed",
      date: new Date(),
    });
    await response.save();

    // Respond with success message
    res.status(200).json({ msg: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// // Change Password after Login
// app.post("/change-password", async (req, res) => {
//   const { name, token, currentPassword, newPassword } = req.body;

//   try {
//     // Verify JWT token
//     const decoded = jwt.verify(token, jwtPassword);
//     if (!decoded || decoded.id !== name) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     // Find user by name and current password
//     const user = await User.findOne({ name, password: currentPassword });

//     // Check if user exists and password matches
//     if (!user) {
//       return res.status(404).json({ msg: "Invalid credentials" });
//     }

//     // Update user's password with new password
//     user.password = newPassword;
//     await user.save();

//     // Respond with success message
//     res.status(200).json({ msg: "Password changed successfully" });
//   } catch (error) {
//     res.status(500).json({ msg: "Server error" });
//   }
// });

const attendanceSchema = new mongoose.Schema({
  userId: String,
  date: Date,
});

const responseSchema = new mongoose.Schema({
  userId: String,
  response: String,
  date: Date,
});

// Create Mongoose models based on the schemas
// const User = mongoose.model("User", userSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
const Response = mongoose.model("Response", responseSchema);

// app.use(express.json());

// Mark Attendance for Student
app.post("/mark-attendance", async (req, res) => {
  const { name, token } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwtPassword);
    if (!decoded || decoded.id !== name) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Find user by name and role
    const user = await User.findOne({ name, role: "student" });
    if (!user) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Mark attendance
    const attendance = new Attendance({
      userId: user.id,
      date: new Date(),
    });
    await attendance.save();

    res.status(200).json({ msg: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Record Student Response
app.post("/record-response", async (req, res) => {
  const { name, token, response } = req.body;

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, jwtPassword);
    if (!decoded || decoded.id !== name) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Find user by name and role
    const user = await User.findOne({ name, role: "student" });
    if (!user) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Save response
    const studentResponse = new Response({
      userId: user.id,
      response: response,
      date: new Date(),
    });
    await studentResponse.save();

    res.status(200).json({ msg: "Response recorded successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});