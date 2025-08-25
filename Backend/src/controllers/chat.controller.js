const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');


async function createChat(req, res) {

    const { title } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });

}

async function getChats(req, res) {
    const user = req.user;

    const chats = await chatModel.find({ user: user._id });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }))
    });
}

async function getMessages(req, res) {

    const chatId = req.params.id;

    const messages = await messageModel.find({ chat: chatId }).sort({ createdAt: 1 });

    res.status(200).json({
        message: "Messages retrieved successfully",
        messages: messages
    })

}

// Like a message
async function likeMessage(req, res) {
    const messageId = req.params.id;
    const message = await messageModel.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    message.likes = (message.likes || 0) + 1;
    if (message.dislikes > 0) message.dislikes -= 1;
    await message.save();
    res.json({ message: 'Message liked', likes: message.likes, dislikes: message.dislikes });
}

// Dislike a message
async function dislikeMessage(req, res) {
    const messageId = req.params.id;
    const message = await messageModel.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    message.dislikes = (message.dislikes || 0) + 1;
    if (message.likes > 0) message.likes -= 1;
    await message.save();
    res.json({ message: 'Message disliked', likes: message.likes, dislikes: message.dislikes });
}

// Regenerate an AI message (simulate new content)
async function regenerateMessage(req, res) {
    const messageId = req.params.id;
    const oldMsg = await messageModel.findById(messageId);
    if (!oldMsg) return res.status(404).json({ message: 'Message not found' });
    // Simulate new AI response (replace with real AI call)
    const newContent = `Regenerated: ${oldMsg.content}`;
    const newMsg = await messageModel.create({
        user: oldMsg.user,
        chat: oldMsg.chat,
        content: newContent,
        role: 'model',
        likes: 0,
        dislikes: 0
    });
    res.json({ message: 'AI response regenerated', newMessage: newMsg });
}

module.exports = {
    createChat,
    getChats,
    getMessages,
    likeMessage,
    dislikeMessage,
    regenerateMessage
};