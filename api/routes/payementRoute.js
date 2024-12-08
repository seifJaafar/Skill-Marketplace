// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const payementController = require('../controllers/payementController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
router.route('/create-payment-intent').post(authorize(), payementController.createPaymentIntent);
router.route('/create-payment-intent-course').post(authorize(), payementController.CourseCreatePaymentIntent);
router.route('/saveEnrollment').post(authorize(), payementController.SaveEnrollment);
router.route('/mark-job-as-paid').post(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert']), payementController.markJobAsPaid);
router.route('/mark-job-as-done').post(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert']), payementController.markJobAsDone);
router.route('/refund').post(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert']), payementController.requestRefund);

module.exports = router;
