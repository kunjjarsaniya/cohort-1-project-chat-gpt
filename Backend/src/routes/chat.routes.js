const express = require('express');
const authMiddleware = require("../middlewares/auth.middleware")
const chatController = require("../controllers/chat.controller")


const router = express.Router();

/* POST /api/chat/ */
router.post('/', authMiddleware.authUser, chatController.createChat)


/* GET /api/chat/ */
router.get('/', authMiddleware.authUser, chatController.getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware.authUser, chatController.getMessages)

// Feedback and regenerate endpoints
router.post('/messages/:id/like', authMiddleware.authUser, chatController.likeMessage);
router.post('/messages/:id/dislike', authMiddleware.authUser, chatController.dislikeMessage);
router.post('/messages/:id/regenerate', authMiddleware.authUser, chatController.regenerateMessage);

module.exports = router;