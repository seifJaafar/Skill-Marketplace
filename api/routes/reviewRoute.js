const express = require('express');
const reviewController = require('../controllers/reviewController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const { validateReview } = require("../middelwares/ValidateAddReview")
const router = express.Router();
router.route('/').post(authorize(), roleAuthorize(['admin', 'skillprovider', "skillexpert"]), validateReview, reviewController.addReview);
router.route('/:id').get(authorize(), roleAuthorize(['admin', 'skillprovider', "skillexpert"]), reviewController.getReviewsByReviewee)
    .delete(authorize(), roleAuthorize(['admin', 'skillprovider', "skillexpert"]), reviewController.deleteReview)
    .patch(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert']), reviewController.updateReview);

module.exports = router;