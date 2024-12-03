const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authorize = require("../middelwares/auth")
router.post('/', authorize(), messageController.sendMessage);
// Route to send a message
router.route('/:conversationId/last-message')
  .get(authorize(), messageController.fetchLastMessageByConversation);  // Route to fetch the last message in a conversation
router.route('/:conversationId/messages')
  .get(authorize(), messageController.fetchMessagesByConversation);  // Route to fetch messages by conversation
module.exports = router;
