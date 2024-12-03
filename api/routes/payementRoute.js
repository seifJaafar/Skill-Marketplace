// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const payementController = require('../controllers/payementController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
router.route('/create-payment-intent').post(authorize(), payementController.createPaymentIntent);
router.route('/mark-job-as-paid').post(authorize(), roleAuthorize(['admin', 'skillprovider', 'skillexpert']), payementController.markJobAsPaid);


module.exports = router;
