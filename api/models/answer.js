const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Reference to the Quiz model
        required: true
    },
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question', // Reference to Question model
            required: true
        },
        selectedOption: {
            type: String,
            required: true
        }
    }],
    score: {
        type: Number,
        default: 0 // Calculate based on correct answers
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

const Answer = mongoose.model('Answer', answerSchema);
module.exports = Answer;
