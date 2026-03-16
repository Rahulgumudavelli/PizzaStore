const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMyMessages,
  markAsRead,
  getUnreadMessages,
  markAllRead
} = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, adminOnly, sendMessage);
router.get('/my-messages', protect, getMyMessages);
router.get('/unread-count', protect, getUnreadMessages);
router.put('/mark-all-read', protect, markAllRead);
router.put('/:id/read', protect, markAsRead);

module.exports = router;