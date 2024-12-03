const express = require('express');
const skillController = require('../controllers/skillController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const { validateSkill } = require("../middelwares/ValidateAddSkill")

const router = express.Router();
router.route('/').get(skillController.getAll)
    .post(authorize(), roleAuthorize('admin'), validateSkill, skillController.create);
router.route('/:id').patch(authorize(), roleAuthorize('admin'), validateSkill, skillController.update)
    .delete(authorize(), roleAuthorize('admin'), skillController.delete);
module.exports = router;