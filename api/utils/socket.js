const Message = require('../models/message');

module.exports = (io) => {
    // Handle a user connecting
    io.on('connection', (socket) => {

        // Handle joining a conversation room
        socket.on('joinConversation', (conversationId) => {
            socket.join(conversationId);
        });

        // Handle sending a message
        socket.on('sendMessage', async (messageData) => {
            try {
                const { conversationId, senderId, senderUsername, content } = messageData;
                if (!conversationId || !senderId || !content?.trim()) {
                    console.error('Invalid message data:', messageData);
                    return socket.emit('error', { message: 'Invalid message data' });
                }
                const message = {
                    conversationId,
                    senderId,
                    senderUsername,
                    content,
                    createdAt: new Date(),
                };
                io.to(conversationId).emit('receiveMessage', message);
            } catch (error) {
                console.error('Error handling sendMessage:', error);
                socket.emit('error', { message: 'An error occurred while sending the message' });
            }
        });

        // Handle user disconnecting
        socket.on('disconnect', () => {
        });
    });
};
