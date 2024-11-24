const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('MongoDB connected successfully');
    } catch (e) {
        console.log('MongoDB connection error:', e.message);
        process.exit(1);
    }
};
module.exports = connectDB;