const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const skillRoute = require('./routes/skillRoute');
const quizRoute = require('./routes/quizRoute');
const EventEmitter = require('events');
EventEmitter.defaultMaxListeners = 15;
dotenv.config();
/*----------------MIDDLEWARES-----------------*/
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
    origin: allowedOrigins
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*--------------DB---------------*/
connectDB();
/*--------------ROUTES---------------*/
app.use('/auth', authRoute);
app.use('/skill', skillRoute);
app.use('/quiz', quizRoute);
/*------------------ERROR HANDLING-------------------*/
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = "Something went wrong" }
    res.status(status).json({ message: err.message })
})
/*--------------SERVER START---------------*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));