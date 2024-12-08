const express = require('express');
const reviewController = require('../controllers/reviewController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
const { validateReview } = require("../middelwares/ValidateAddReview")
const router = express.Router();
router.route('/').post(authorize(), roleAuthorize(['admin', 'skillprovider', "skillexpert",'client']), validateReview, reviewController.addReview);
router.route('/:id').get(authorize(), roleAuthorize(['admin', 'skillprovider', "skillexpert","client"]), reviewController.getReviewsByReviewee)
    .delete(authorize(), roleAuthorize(['admin', 'skillprovider', "skillexpert",'client']), reviewController.deleteReview)
    .patch(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert','client']), reviewController.updateReview);

module.exports = router;