import React, { useState, useEffect } from 'react';
import { useSocket } from '../custom/socketContext';

import { GetConversations } from "../actions/conversation.action";
import { GetLastMessageByConversation } from "../actions/message.action";
import { Avatar, ChatList } from 'react-chat-elements';
import '../assets/conversationList.css';

function ConversationList({ onConversationSelect, userId, conversations }) {
    const handleConversationClick = (conversationId) => {
        onConversationSelect(conversationId);
    };




    /*useEffect(() => {
        if (newMessage) {
            setConversations((prevConversations) => {
                const updatedConversations = [...prevConversations];
                const conversationIndex = updatedConversations.findIndex(
                    (conv) => conv._id === newMessage.conversationId
                );
                if (conversationIndex !== -1) {
                    updatedConversations[conversationIndex].messages.push(newMessage);
                    updatedConversations[conversationIndex].lastMessage = newMessage; // Update the last message
                } else {
                    updatedConversations.push({
                        _id: newMessage.conversationId,
                        messages: [newMessage],
                        providerId: newMessage.providerId,
                        lastMessage: newMessage, // Set the new message as the last message
                    });
                }
                return updatedConversations;
            });
        }
    }, [newMessage]); */

    const dataSource = conversations.map((conversation) => {
        const lastMessage = conversation.lastMessage || { content: 'No messages yet', createdAt: Date.now() };
        const username = conversation.participants?.[0]?.username || 'Unknown User';
        const unreadCount = conversation.unreadCount || 0;
        const formattedDate = lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleString() : '';
        return {
            key: conversation._id, // Ensure conversation ID is included here
            alt: String(username), // Ensure it's a string
            title: String(username), // Ensure it's a string
            subtitle: String(lastMessage.content || "No messages yet"), // Ensure it's a string
            date: formattedDate,
            unread: unreadCount,
        };
    });
    useEffect(() => {
        
        if (conversations.length > 0) {
           
            const dataSource = conversations.map((conversation) => {
                const lastMessage = conversation.lastMessage || { content: 'No messages yet', createdAt: Date.now() };
                const username = conversation.participants?.[0]?.username || 'Unknown User';
                const unreadCount = conversation.unreadCount || 0;
                const formattedDate = lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleString() : '';
                return {
                    key: conversation._id, // Ensure conversation ID is included here
                    alt: String(username), // Ensure it's a string
                    title: String(username), // Ensure it's a string
                    subtitle: lastMessage
                        ? (lastMessage?.senderId == userId
                            ? `Me: ${lastMessage?.content || '...'}`
                            : `${lastMessage?.senderUsername || 'Unknown'}: ${lastMessage.content || '...'}`)
                        : "No messages yet",
                    date: formattedDate,
                    unread: unreadCount,
                };
            });
        }

    }, [conversations]);
    return (
        <div className="conversation-list">
            <h3>Conversations</h3>
            <div className="conversation-container">
                {conversations.length > 0 ? (
                    <ChatList
                        className="chat-list"
                        dataSource={dataSource}
                        onClick={(item) => handleConversationClick(item.key)} // Pass the _id here
                    />
                ) : (
                    <p>No conversations available</p>
                )}
            </div>
        </div>
    );
}

export default ConversationList;
