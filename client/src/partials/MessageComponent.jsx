import React, { useState, useEffect } from 'react';
import { useSocket } from '../custom/socketContext'; // Custom socket context
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { MessageList } from 'react-chat-elements'; // Importing components from react-chat-elements
import { GetMessagesByConversations, SendMessage } from '../actions/message.action'; // Import the action to fetch messages
import '../assets/messageComponent.css'; // Import CSS for the message component
import 'react-chat-elements/dist/main.css'; // Import CSS for react-chat-elements

function MessageComponent({ conversationId, userId, onSendMessage, messages }) {

    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) { return };
        const message = {
            content: newMessage,
            conversationId,
            senderId: userId,
            createdAt: new Date().toISOString(),
        };
        try {
            const response = await SendMessage(message);
            if (response.error) {
                console.error(response.error);
                return;
            }
            onSendMessage(response);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }


    };

    useEffect(() => {
        // If messages is empty, set loading state to true
        if (!messages.length) {
            setLoading(true);
        } else {
            setLoading(false); // Set loading to false when messages are populated
        }
    }, [messages]);
    return (

        <div className="message-container">
            <div className="messages-list">
                {loading ? (
                    <p>Loading messages...</p>
                ) : (
                    <MessageList
                        className="message-list"
                        lockable={true}
                        toBottomHeight="100%"
                        dataSource={messages.map((msg) => ({
                            position: msg.senderId === userId ? 'right' : 'left',
                            type: 'text',
                            title: msg.senderId === userId ? "Me" : msg.senderUsername || "user", // Replace with sender's name
                            text: msg.content,
                            date: new Date(msg.createdAt),
                        }))}
                    />
                )}
            </div>

            <div className="input-container">
                <InputTextarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)} // Remove the trim() here to handle full input
                    rows={3}
                    cols={30}
                    placeholder="Type your message..."
                    autoResize
                />
                <Button
                    label="Send"
                    icon="pi pi-send"
                    onClick={handleSendMessage}
                    className="send-button"
                />
            </div>
        </div>
    );
}

export default MessageComponent;
