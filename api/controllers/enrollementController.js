const mongoose = require('mongoose');
const ExpressError = require('../utils/ExpressError');
const apiJson = require('../utils/apiJson');
const Course = require('../models/course');
const user = require('../models/User')
const Enrollment = require('../models/enrollement');
const path = require('path');

exports.verifyEnrollment = async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.user.sub;
    console.log(courseId);
    console.log(userId);
    const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
    if (!enrollment) {
        return res.status(200).json({ Enrolled: false });
    }
    res.status(200).json({ Enrolled: true });
}
exports.getAllEnrollments = async (req, res, next) => {
    try {
        const userId = req.user.sub;
        if (!userId) {
            return res.status(400).json({ message: 'User not found' });
        }

        const enrollments = await Enrollment.find({ user: userId }).populate({
            path: 'course', // Populate the `course` field
            populate: {
                path: 'chapters', // Populate the `chapters` field inside `course`
                populate: {
                    path: 'files', // Populate the `files` field inside `chapters`
                },
            },
        });

        res.status(200).json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
