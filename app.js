require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const users = require("./models/userSchema");
const cors = require("cors");
const resourcesRouter = require("./routes/resourcesRouter");
const resultsRouter = require("./routes/resultsRouter");
const mailRouter = require("./routes/mail");
const attendanceRouter = require("./routes/attendanceRoutes");
const userRouter = require("./routes/userRouter");
const scheduleRouter = require("./routes/scheduleRouter");

const port = process.env.PORT || 8003;

// Configure CORS to allow requests from your frontend
const corsOptions = {
    origin: "https://victors-frontend.vercel.app",
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    methods: ["GET", "POST", "PUT", "DELETE"],
};

// Apply CORS middleware with the specified options
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use("/resources", resourcesRouter);
app.use("/results", resultsRouter);
app.use("/mail", mailRouter);
app.use("/attendance", attendanceRouter);
app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);

// Serve static files and handle SPA for production
if (process.env.NODE_ENV == 'production') {
    const path = require('path');
    app.use(express.static(path.resolve(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// Start server
app.listen(port, () => {
    console.log(`Server is running on port number ${port}`);
});
