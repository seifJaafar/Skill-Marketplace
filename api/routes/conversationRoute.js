const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');
const authorize = require("../middelwares/auth")
const roleAuthorize = require("../middelwares/roleAuth")
router.route('/').post(authorize(), roleAuthorize(['admin', 'skillprovider', 'client', 'skillexpert']), conversationController.createConversation);  // Route to create a conversation
router.route('/byUser').get(authorize(), roleAuthorize(['admin', 'skillprovider', 'client', 'skillexpert']), conversationController.getConversations);  // Route to get all conversations for a user
module.exports = router;
