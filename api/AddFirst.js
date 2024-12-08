const mongoose = require('mongoose');

const dotenv = require('dotenv').config();

const User = require('./models/user');

mongoose.connect(process.env.DB_URI).then(() => {
    console.log("Database Connected")
});;

const createAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });





        const admin = new User({
            email: process.env.ADMIN_EMAIL,
            password: process.env.ADMIN_PASSWORD,
            username: process.env.ADMIN_USERNAME,
            role: 'admin',
            approved: true
        });

        await admin.save();
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        mongoose.connection.close();
    }
};

createAdmin();