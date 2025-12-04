import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConversations, getMessages, sendMessage, addMessage } from '../redux/slices/chatSlice';
import { io } from 'socket.io-client';

const ENDPOINT = 'http://localhost:8000';
let socket;

const Chat = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { conversations, messages, loading } = useSelector((state) => state.chat);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket = io(ENDPOINT);
        if (user) {
            socket.emit('join_chat', user._id);
        }

        socket.on('receive_message', (message) => {
            const senderId = message.sender?._id || message.sender;
            const selectedUserId = selectedUser?._id || selectedUser;
            if (selectedUser && (senderId?.toString() === selectedUserId?.toString())) {
                dispatch(addMessage(message));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user, selectedUser, dispatch]);

    useEffect(() => {
        dispatch(getConversations());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            dispatch(getMessages(selectedUser._id));
        }
    }, [dispatch, selectedUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser) return;

        const messageData = {
            receiverId: selectedUser._id || selectedUser,
            text: newMessage,
        };

        const result = await dispatch(sendMessage(messageData));
        if (result.payload) {
            socket.emit('send_message', { ...result.payload, receiver: selectedUser });
        }
        setNewMessage('');
    };

    return (
        <div className="container mx-auto p-4 h-[calc(100vh-100px)] flex gap-4">
            {/* Sidebar - Conversations */}
            <div className="w-1/3 border-r pr-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Messages</h2>
                {loading && !conversations.length ? (
                    <p>Loading...</p>
                ) : conversations.length === 0 ? (
                    <p>No conversations yet.</p>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.user._id}
                            onClick={() => setSelectedUser(conv.user)}
                            className={`flex items-center p-3 cursor-pointer rounded-lg mb-2 hover:bg-gray-100 ${selectedUser?._id === conv.user._id ? 'bg-gray-100' : ''
                                }`}
                        >
                            <img
                                src={conv.user.avatar || 'https://via.placeholder.com/40'}
                                alt={conv.user.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div>
                                <h3 className="font-semibold">{conv.user.name}</h3>
                                <p className="text-sm text-gray-500 truncate w-40">{conv.lastMessage}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Main Chat Window */}
            <div className="w-2/3 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="border-b pb-4 mb-4 flex items-center">
                            <img
                                src={selectedUser.avatar || 'https://via.placeholder.com/40'}
                                alt={selectedUser.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <h2 className="text-xl font-bold">{selectedUser.name}</h2>
                        </div>

                        <div className="flex-1 overflow-y-auto mb-4 p-2 bg-gray-50 rounded-lg">
                            {messages.map((msg, index) => {
                                const senderId = msg.sender?._id || msg.sender;
                                const userId = user?._id || user;
                                const isOwnMessage = senderId?.toString() === userId?.toString();
                                return (
                                    <div
                                        key={msg._id || index}
                                        className={`flex mb-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg max-w-xs ${isOwnMessage
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-white border'
                                                }`}
                                        >
                                            <p>{msg.text}</p>
                                            <span className={`text-xs block mt-1 ${isOwnMessage ? 'text-rose-100' : 'text-gray-400'}`}>
                                                {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border p-2 rounded-lg focus:outline-none focus:border-rose-500"
                            />
                            <button
                                type="submit"
                                className="bg-rose-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-700"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Chat;
