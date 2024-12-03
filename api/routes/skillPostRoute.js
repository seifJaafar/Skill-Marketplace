const express = require('express');
const skillPostController = require('../controllers/skillPostController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const { validateSkillPost } = require("../middelwares/validateAddSkillPost")
const { validateUpdateSkillPost } = require("../middelwares/validateUpdateSkillPost")
const router = express.Router();
router.route('/').get(authorize(), skillPostController.getSkillPosts)
    .post(authorize(), validateSkillPost, roleAuthorize(['admin', 'skillprovider']), skillPostController.addSkillPost);
router.route('/user').get(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert']), skillPostController.getSkillPostsByUser);
router.route('/:id').get(authorize(), skillPostController.getSkillPostById)
    .delete(authorize(), roleAuthorize(['admin', 'skillprovider']), skillPostController.deleteSkillPost)
    .patch(authorize(), roleAuthorize(['admin', 'skillprovider']), validateUpdateSkillPost, skillPostController.updateSkillPost);
router.route('/:id/link')
    .patch(authorize(), roleAuthorize(['admin', 'skillprovider']), skillPostController.linkUserToSkillPost);
module.exports = router;