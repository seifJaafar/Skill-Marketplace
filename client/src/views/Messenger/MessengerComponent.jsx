import React, { useState, useEffect } from 'react';
import ConversationList from '../../partials/ConversationList';
import MessageComponent from '../../partials/MessageComponent';
import { useSocket } from '../../custom/socketContext';
import { GetConversations } from "../../actions/conversation.action";
import { GetLastMessageByConversation, GetMessagesByConversations } from "../../actions/message.action";

import { Button } from 'primereact/button';
import "../../assets/messenger.css";

function MessengerComponent({ user }) {
    const socket = useSocket();
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [toggleConversationList, setToggleConversationList] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const fetchMessages = async (conversationId) => {
        try {
            const data = await GetMessagesByConversations(conversationId);
            setMessages(data || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };
    const fetchConversations = async () => {
        try {
            const response = await GetConversations();
            if (response.error) {
                console.error('Error fetching conversations:', response.error);
                return;
            }

            const conversationsWithLastMessages = await Promise.all(
                response.map(async (conversation) => {
                    const lastMessage = await GetLastMessageByConversation(conversation._id);

                    return {
                        ...conversation,
                        lastMessage: lastMessage || { content: 'No messages yet', timestamp: Date.now() },
                    };
                })
            );

            setConversations(conversationsWithLastMessages || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };


    const sendmessage = async (message) => {
        if (!message || !selectedConversationId) { return }

        if (socket) {
            socket.emit('joinConversation', selectedConversationId);
            socket.emit('sendMessage', message); // This will trigger the 'receiveMessage' event in other clients
        }
        setConversations((prevConversations) =>
            prevConversations.map((conv) =>
                conv._id === selectedConversationId
                    ? {
                        ...conv,
                        lastMessage: message,
                    }
                    : conv
            )
        );
        setMessages((prevMessages) => [...prevMessages, message]);
    };
    useEffect(() => {
        if (selectedConversationId) {
            fetchMessages(selectedConversationId);
        }
    }, [selectedConversationId]);
    useEffect(() => {
        fetchConversations();

    }, [socket]);
    useEffect(() => {
        if (socket) {
            conversations.forEach((conversation) => {
                socket.emit('joinConversation', conversation._id);
                socket.on('receiveMessage', (message) => {
                    if (message.senderId !== user._id) {
                        setConversations((prevConversations) =>
                            prevConversations.map((conv) =>
                                conv._id === selectedConversationId
                                    ? {
                                        ...conv,
                                        lastMessage: message,
                                    }
                                    : conv
                            )
                        );
                        setMessages((prevMessages) => [...prevMessages, message]);
                    }

                });
            })
        }
        return () => {
            if (socket) {
                socket.off('receiveMessage');
            }
        };
    }, [conversations, socket])
    const handleConversationSelect = (conversationId) => {
        setSelectedConversationId(conversationId);
    };
    const showConversationList = () => {
        setToggleConversationList((prev) => !prev);
    };
    const handleBackToConversations = () => {
        setSelectedConversationId(null); // Clear the selected conversation
    };
    return (
        <div className="app-container">

            <div
                className={`conversation-list-container ${toggleConversationList ? '' : 'collapsed'}`}
            >
                <Button
                    label={toggleConversationList ? 'Hide Conversations' : 'Show Conversations'}
                    onClick={showConversationList}
                    className="p-button-raised"
                />

                {toggleConversationList && (
                    <div className="conversation-list-wrapper">
                        <ConversationList onConversationSelect={handleConversationSelect} userId={user._id} conversations={conversations} />
                    </div>
                )}
            </div>
            <div className={`message-component-wrapper ${toggleConversationList ? '' : 'collapsed'}`}>
                {toggleConversationList && (
                    <div
                        className={`message-component-container ${selectedConversationId ? 'show' : ''}`}
                    >

                        {selectedConversationId && (
                            <>
                                <Button
                                    label="Close"
                                    onClick={handleBackToConversations}
                                    icon="pi pi-times"
                                    className="p-button-text"
                                />
                                <MessageComponent conversationId={selectedConversationId} messages={messages} userId={user._id} onSendMessage={sendmessage} />
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

export default MessengerComponent;








