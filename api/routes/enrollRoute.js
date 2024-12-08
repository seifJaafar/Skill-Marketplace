const express = require('express');
const router = express.Router();
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const controller = require('../controllers/enrollementController');
router.route('/').get(authorize(), controller.getAllEnrollments)
router.route('/verify/:courseId').get(authorize(), controller.verifyEnrollment)
module.exports = router;