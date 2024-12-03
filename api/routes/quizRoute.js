const express = require('express');
const quizController = require('../controllers/quizController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const { validateQuestion } = require("../middelwares/ValidateAddQuestion")
const { validateQuiz } = require("../middelwares/ValidateQuiz")
const { validateUpdateQuestion } = require("../middelwares/ValidateUpdateQuestion")
const router = express.Router();
router.route('/addQuestion').post(authorize(), roleAuthorize('admin'), validateQuestion, quizController.addQuestionToQuiz);
router.route('/').get(authorize(), roleAuthorize('admin'), quizController.getAllQuiz)
    .post(authorize(), roleAuthorize('admin'), validateQuiz, quizController.addQuiz);
router.route('/update/:quizId').patch(authorize(), roleAuthorize('admin'), validateQuiz, quizController.updateQuiz)
    .delete(authorize(), roleAuthorize('admin'), quizController.deleteQuiz);

router.route('/question/:questionId').patch(authorize(), roleAuthorize('admin'), validateUpdateQuestion, quizController.updateQuestion)
    .delete(authorize(), roleAuthorize('admin'), quizController.deleteQuestion);
router.route('/:skillId').get(quizController.getQuizForSkillId)
module.exports = router;