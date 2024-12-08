const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoute = require('./routes/authRoute');
const skillRoute = require('./routes/skillRoute');
const quizRoute = require('./routes/quizRoute');
const skillPostRoute = require('./routes/skillPostRoute');
const reviewRoute = require('./routes/reviewRoute');
const conversationRoute = require('./routes/conversationRoute');
const messageRoute = require('./routes/messageRoute');
const jobRoute = require('./routes/jobRoute');
const payementRoute = require('./routes/payementRoute');
const webhookRoute = require('./routes/webhookRoute');
const coursesRoute = require('./routes/coursesRoute');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

dotenv.config();

/*----------------MIDDLEWARES-----------------*/
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());
app.use(cors({
    origin: allowedOrigins
}));
app.use('/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})
/*--------------DB---------------*/
connectDB();

/*--------------ROUTES---------------*/
app.use('/auth', authRoute);
app.use('/skill', skillRoute);
app.use('/quiz', quizRoute);
app.use('/skillpost', skillPostRoute);
app.use('/review', reviewRoute);
app.use('/conversation', conversationRoute);
app.use('/message', messageRoute);
app.use('/job', jobRoute);
app.use('/payment', payementRoute);
app.use('/webhook', webhookRoute);
app.use('/courses', coursesRoute);
/*------------------ERROR HANDLING-------------------*/
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) { err.message = "Something went wrong" }
    res.status(status).json({ message: err.message })
    console.log(err);
})

/*--------------SERVER START WITH SOCKET.IO---------------*/
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: allowedOrigins,  // Allowing the origins from your .env
        methods: ['GET', 'POST']
    }
}); // Attach socket.io to the server

// Socket.io logic goes here
require('./utils/socket')(io);  // Import the socket logic (we'll define this file next)

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
