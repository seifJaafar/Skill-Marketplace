const express = require('express');
const router = express.Router();
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const checkStripe = require("../middelwares/checkStripeConnected")
const coursesController = require('../controllers/coursesController');
const { uploadFiles } = require('../utils/CoursesFilesUpload');
router.route('/').get(authorize(), coursesController.GetCourses) // Route to get all courses
    .post(authorize(), roleAuthorize(["skillexpert"]), checkStripe, uploadFiles, coursesController.AddCourse);  // Route to add a course
router.route('/updateChapter/:id').patch(authorize(), roleAuthorize(['skillexpert', 'admin']), uploadFiles, coursesController.UpdateChapter)
    .delete(authorize(), roleAuthorize(['skillexpert', 'admin']), coursesController.DeleteChapter)
router.route('/updateFile/:id').patch(authorize(), roleAuthorize(['skillexpert', 'admin']), coursesController.UpdateFile)
    .delete(authorize(), roleAuthorize(['skillexpert', 'admin']), coursesController.DeleteFile)
router.route('/addChapter/:id').post(authorize(), roleAuthorize(['skillexpert', 'admin']), uploadFiles, coursesController.AddChapter)
router.route('/getChapters/:id').get(authorize(), coursesController.GetChapters)
router.route('/:id').get(authorize(), coursesController.GetCourseByid)
    .patch(authorize(), roleAuthorize(['skillexpert']), coursesController.UpdateCourse)
    .delete(authorize(), roleAuthorize(['skillexpert', 'admin']), coursesController.DeleteCourse)
module.exports = router;
