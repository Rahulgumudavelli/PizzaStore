const {
  sendOrderMessage,
  getUserMessages,
  readMessage,
  getUnreadCount,
  markAllMessagesAsRead
} = require('../services/messageService');

// SEND message (admin)
const sendMessage = async (req, res) => {
  try {
    const newMessage = await sendOrderMessage(req.body);
    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET messages for user
const getMyMessages = async (req, res) => {
  try {
    const messages = await getUserMessages(req.user.id);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK message as read
const markAsRead = async (req, res) => {
  try {
    const message = await readMessage(req.params.id);
    res.status(200).json({
      message: 'Message marked as read',
      data: message
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET unread messages count
const getUnreadMessages = async (req, res) => {
  try {
    const count = await getUnreadCount(req.user.id);
    res.status(200).json({ unreadCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK ALL as read
const markAllRead = async (req, res) => {
  try {
    await markAllMessagesAsRead(req.user.id);
    res.status(200).json({ message: 'All messages marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getMyMessages,
  markAsRead,
  getUnreadMessages,
  markAllRead
};