const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    senderUsername: { type: String },
    content: String,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
