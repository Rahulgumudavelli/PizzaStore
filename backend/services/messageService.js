const Message = require('../models/Message');

const sendOrderMessage = async (messageData) => {
  const { userId, orderId, message } = messageData;

  const newMessage = await Message.create({
    userId,
    orderId,
    message,
    isRead: false
  });

  return newMessage;
};

const getUserMessages = async (userId) => {
  const messages = await Message.find({ userId })
    .populate('orderId', 'orderStatus totalAmount')
    .sort({ createdAt: -1 });

  return messages;
};

const readMessage = async (messageId) => {
  const message = await Message.findByIdAndUpdate(
    messageId,
    { isRead: true },
    { new: true }
  );

  if (!message) {
    throw new Error('Message not found');
  }

  return message;
};

const getUnreadCount = async (userId) => {
  const count = await Message.countDocuments({
    userId,
    isRead: false
  });
  return count;
};

const markAllMessagesAsRead = async (userId) => {
  return await Message.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

module.exports = {
  sendOrderMessage,
  getUserMessages,
  readMessage,
  getUnreadCount,
  markAllMessagesAsRead
};