const Message = require('../models/message');
const Conversation = require('../models/conversation');
const User = require('../models/User');
const sendMessage = async (req, res) => {
    const { conversationId, content } = req.body;
    const senderId = req.user.sub;
    const sender = await User.findById(senderId).select('username');
    const message = new Message({
        conversationId,
        senderId,
        senderUsername: sender.username,
        content,
        createdAt: new Date(),
    });

    try {
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }
        if (content === "") {
            return res.status(400).json({ error: 'Message content is required' });
        }
        await message.save();
        res.status(201).json(message);  // Send the saved message back
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Failed to save message' });
    }
};

const fetchMessagesByConversation = async (req, res) => {
    const { conversationId } = req.params;

    if (!conversationId) {
        return res.status(400).json({ error: 'Conversation ID is required' });
    }

    try {
        // Find messages by conversationId and sort by createdAt in ascending order
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        return res.status(200).json({ messages: messages || [] });
    } catch (error) {
        console.error('Error fetching messages:', error);
        next(error);
    }
};
const fetchLastMessageByConversation = async (req, res, next) => {
    const { conversationId } = req.params; // Assuming the conversationId is passed in the route parameters

    try {
        if (!conversationId) {
            return res.status(400).json({ error: 'Conversation ID is required' });
        }

        // Fetch the last message for the conversation
        const message = await Message.find({ conversationId })
            .sort({ createdAt: -1 })
            .limit(1)
            .exec();

        // Check if there are any messages
        if (message && message.length > 0) {
            return res.status(200).json({ message: message[0] });
        }

        // If no messages are found
        return res.status(200).json({ message: 'No messages yet' });

    } catch (error) {
        console.error('Error fetching messages:', error);
        return next(error); // Pass the error to the error-handling middleware
    }
};

module.exports = {
    sendMessage,
    fetchMessagesByConversation,
    fetchLastMessageByConversation
};
