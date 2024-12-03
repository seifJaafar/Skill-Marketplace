const Conversation = require('../models/conversation');

const createConversation = async (req, res) => {
    console.log("create")
    const { providerId } = req.body;  // Get the provider ID from the request body
    const senderId = req.user.sub;    // Get the logged-in user's ID from the request object

    try {
        // Check if a conversation already exists between sender and provider
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, providerId] }
        });

        // If no conversation exists, create a new one
        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, providerId],
                messages: []  // Optional: initialize with an empty array of messages
            });
            await conversation.save();  // Save the new conversation to the database
        }

        // Return the conversation (either the existing or newly created one)
        res.status(200).json(conversation);
    } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Error creating conversation' });
    }
};

const getConversations = async (req, res) => {
    try {
        const userId = req.user.sub;  // Assuming the user ID is in req.user.sub
        const conversations = await Conversation.find({
            participants: { $in: [userId] }  // Check if userId is in the participants array
        }).populate({
            path: 'participants',  // The field to populate
            select: 'username',     // The fields you want to populate, e.g., username
            match: { _id: { $ne: userId } }  // Optional: exclude the current user (if necessary)
        });

        res.status(200).json(conversations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createConversation,
    getConversations
};
