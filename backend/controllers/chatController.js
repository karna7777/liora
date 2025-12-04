import Message from '../models/Message.js';
import User from '../models/User.js';

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiverId, text, listingId } = req.body;

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiverId,
            text,
            listing: listingId,
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get messages between current user and another user
// @route   GET /api/chat/:userId
// @access  Private
const getMessages = async (req, res) => {
    try {
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                { sender: req.user._id, receiver: userId },
                { sender: userId, receiver: req.user._id },
            ],
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar');

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get conversations (users chatted with)
// @route   GET /api/chat/conversations
// @access  Private
const getConversations = async (req, res) => {
    try {
        // Find all messages where current user is sender or receiver
        const messages = await Message.find({
            $or: [{ sender: req.user._id }, { receiver: req.user._id }],
        })
            .populate('sender', 'name avatar')
            .populate('receiver', 'name avatar')
            .sort({ createdAt: -1 });

        const users = new Map();

        messages.forEach((msg) => {
            const otherUser = msg.sender._id.toString() === req.user._id.toString()
                ? msg.receiver
                : msg.sender;

            if (!users.has(otherUser._id.toString())) {
                users.set(otherUser._id.toString(), {
                    user: otherUser,
                    lastMessage: msg.text,
                    timestamp: msg.createdAt
                });
            }
        });

        res.json(Array.from(users.values()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { sendMessage, getMessages, getConversations };
