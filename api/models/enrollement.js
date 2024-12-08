const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: {
        type: String,
        enum: ['enrolled', 'completed', 'dropped'],
        default: 'enrolled'
    }
});

const Enrollment = mongoose.model('Enrollment', EnrollmentSchema);

module.exports = Enrollment;
