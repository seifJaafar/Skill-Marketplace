const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authorize = require("../middelwares/auth")

router.route('/').post(authorize(), conversationController.createConversation);  // Route to create a conversation
router.route('/byUser').get(authorize(), conversationController.getConversations);  // Route to get all conversations for a user
module.exports = router;
