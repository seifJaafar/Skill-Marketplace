const express = require('express');
const webhookController = require('../controllers/webhooksController');
const router = express.Router();

router.route('/stripe').post(webhookController.StripeWebhookAccount);
module.exports = router;