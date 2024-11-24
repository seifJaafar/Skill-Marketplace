const express = require('express');
const quizController = require('../controllers/quizController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")

const router = express.Router();
router.route('/addQuestion').post(authorize(), roleAuthorize('admin'), quizController.addQuestionToQuiz);
router.route('/').get(authorize(), roleAuthorize('admin'), quizController.getAllQuiz)
    .post(authorize(), roleAuthorize('admin'), quizController.addQuiz);
router.route('/update/:quizId').patch(authorize(), roleAuthorize('admin'), quizController.updateQuiz)
    .delete(authorize(), roleAuthorize('admin'), quizController.deleteQuiz);

router.route('/question/:questionId').patch(authorize(), roleAuthorize('admin'), quizController.updateQuestion)
    .delete(authorize(), roleAuthorize('admin'), quizController.deleteQuestion);
router.route('/:skillId').get(quizController.getQuizForSkillId)
module.exports = router;