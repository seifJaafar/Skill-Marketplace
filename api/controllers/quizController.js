const Question = require('../models/question');
const Quiz = require('../models/quiz');
const Skill = require('../models/skill');
const mongoose = require('mongoose');
const apiJson = require('../utils/apiJson');
exports.addQuestionToQuiz = async (req, res) => {
    try {
        let { questionText, options, correctAnswerIndex, quiz } = req.body;
        console.log(req.body);
        quiz = new mongoose.Types.ObjectId(quiz);
        const newQuestion = new Question({
            questionText,
            options,
            correctAnswerIndex,
            quiz,
        });
        await newQuestion.save();
        const quizDoc = await Quiz.findById(quiz);
        if (!quizDoc) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        quizDoc.questions.push(newQuestion._id);
        await quizDoc.save();
        res.status(200).json({
            message: 'Question added successfully to the quiz',
            question: newQuestion,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.testQuestion = async (req, res) => {
    try {
        console.log(req.body);
        res.status(200).json({ message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.getQuizForSkillId = async (req, res) => {
    let { skillId } = req.params;

    try {
        skillId = new mongoose.Types.ObjectId(skillId);
        const quiz = await Quiz.findOne({ skill: skillId }).populate('questions');
        if (!quiz) {
            return res.status(404).json({ message: 'No quiz found for this skill' });
        }
        const data = { quiz };

        apiJson({ req, res, data, model: Quiz });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 2. Submit quiz answers for a specific skillId
exports.submitQuizAnswers = async (req, res) => {
    const { skillId } = req.params;
    const { userAnswers } = req.body;

    try {

        const quiz = await Quiz.findOne({ skill: skillId }).populate('questions');

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found for this skill' });
        }


        let score = 0;
        let totalQuestions = quiz.questions.length;


        for (let i = 0; i < quiz.questions.length; i++) {
            const question = quiz.questions[i];
            const selectedAnswer = userAnswers[i];


            if (selectedAnswer === question.correctAnswer) {
                score++;
            }
        }


        const percentage = (score / totalQuestions) * 100;
        const passed = percentage >= 80;
        res.json({
            passed,
            score,
            percentage,
            message: passed ? 'Congratulations, you passed the quiz!' : 'Sorry, you failed the quiz. Try again!',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllQuiz = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions').populate('skill').sort({ createdAt: -1 });
        const data = { quizzes };

        apiJson({ req, res, data, model: Quiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
exports.addQuiz = async (req, res) => {


    try {
        let { skill, title } = req.body;
        skill = new mongoose.Types.ObjectId(skill);
        const skillDoc = await Skill.findById(skill);
        if (!skillDoc) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (skillDoc.linkedQuiz) {
            return res.status(400).json({ message: 'This skill is already linked to a quiz' });
        }
        const newQuiz = new Quiz({
            skill,
            title,
        });

        await newQuiz.save();
        skillDoc.linkedQuiz = newQuiz._id;
        await skillDoc.save();
        res.status(200).json({
            message: 'Quiz created successfully',
            quiz: newQuiz,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating quiz' });
    }
};



exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { questionText, options, correctAnswerIndex } = req.body;

        // Find the question by ID and update it, returning the updated document
        const question = await Question.findByIdAndUpdate(
            questionId,
            { questionText, options, correctAnswerIndex },
            { new: true }
        );

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        res.status(200).json({
            message: 'Question updated successfully',
            question: question
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating question' });
    }
};
exports.updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        let { title, skill, questions } = req.body
        const skillId = new mongoose.Types.ObjectId(skill);
        const skillDoc = await Skill.findById(skill);
        if (!skillDoc) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        if (skillDoc.linkedQuiz) {
            return res.status(400).json({ message: 'This skill is already linked to a quiz' });
        }
        const quiz = await Quiz.findByIdAndUpdate(
            quizId,
            { title, skill: skillId, questions },
            { new: true }
        )

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        skillDoc.linkedQuiz = quiz._id;
        await skillDoc.save();
        res.status(200).json({
            message: 'Question updated successfully',
            quiz: quiz
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Server error while updating quiz' });
    }
}
exports.deleteQuiz = async (req, res) => {
    try {
        let { quizId } = req.params;

        quizId = new mongoose.Types.ObjectId(quizId);

        // Find the quiz
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Delete the associated questions
        await Question.deleteMany({ _id: { $in: quiz.questions } }); // Assuming `questions` is an array of ObjectIds in the quiz model

        // Update the skill to remove the linked quiz
        const skill = await Skill.findOne({ linkedQuiz: quizId });
        if (skill) {
            skill.linkedQuiz = null;
            await skill.save();
        }

        // Delete the quiz explicitly
        await Quiz.findByIdAndDelete(quizId);

        res.status(200).json({ message: 'Quiz and associated questions deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting quiz' });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { questionId } = req.params;

    try {

        const questionIdObject = new mongoose.Types.ObjectId(questionId);


        const question = await Question.findByIdAndDelete(questionIdObject);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        // Find the quiz associated with the deleted question and remove the question from the questions array
        const quiz = await Quiz.findOneAndUpdate(
            { questions: questionIdObject },
            { $pull: { questions: questionIdObject } },
            { new: true } // Return the updated quiz document
        );

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found or question not associated with quiz' });
        }

        res.status(200).json({
            message: 'Question deleted successfully and removed from the quiz',
            question,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while deleting question' });
    }
};

