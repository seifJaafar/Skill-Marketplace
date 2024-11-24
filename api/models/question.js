const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswerIndex: {
        type: Number,
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    }
}, {
    timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;
