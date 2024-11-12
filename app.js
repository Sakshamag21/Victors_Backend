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

// Set up CORS to allow only specific origin
app.use(cors({
    origin: "https://victors-frontend.vercel.app"
}));

app.use(express.json());

app.use("/resources", resourcesRouter);
app.use("/results", resultsRouter);
app.use("/mail", mailRouter);
app.use("/attendance", attendanceRouter);
app.use("/user", userRouter);
app.use("/schedule", scheduleRouter);

if (process.env.NODE_ENV == 'production') {
    const path = require('path');
    app.get('/', (req, res) => {
        app.use(express.static(path.resolve(__dirname, 'client', 'build')));
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port number ${port}`);
});
