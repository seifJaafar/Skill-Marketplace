const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill', // Reference to the Skill model
        required: true,
        unique: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;
