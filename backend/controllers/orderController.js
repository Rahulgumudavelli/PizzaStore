const Order = require('../models/Order');
require('../models/Address'); // Required for populate('addressId')
const {
  placeOrder,
  updateStatus,
  cancelUserOrder,
  calculateMonthlyRevenue
} = require('../services/orderService');
const { sendOrderMessage } = require('../services/messageService');
const { sendToUser, broadcast } = require('../services/websocketService');

// Helper – build a readable order status label
const statusLabel = (status) => {
  const labels = {
    pending:          'Your order has been received and is pending confirmation.',
    confirmed:        'Great news! Your order has been confirmed.',
    preparing:        'Our chefs are now preparing your order 🍕',
    'out for delivery': 'Your order is out for delivery! 🚴',
    delivered:        'Your order has been delivered. Enjoy your pizza! 🎉',
    cancelled:        'Your order has been cancelled.',
    rejected:         'Unfortunately, your order was rejected.'
  };
  return labels[status] || `Order status updated to: ${status}`;
};

// CREATE order
const createOrder = async (req, res) => {
  try {
    const order = await placeOrder(req.user.id, req.body);

    // 🔔 Real-time notification – order confirmation
    const notificationMessage = `Order #${String(order._id).slice(-8).toUpperCase()} placed successfully! We'll confirm it shortly.`;
    
    // Persist to DB
    await sendOrderMessage({
      userId: req.user.id,
      orderId: order._id,
      message: notificationMessage
    });

    sendToUser(req.user.id, {
      type: 'ORDER_PLACED',
      orderId: order._id,
      status: order.orderStatus,
      message: notificationMessage,
      timestamp: new Date().toISOString()
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET my orders (customer)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('addressId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('addressId')
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, message } = req.body;
    const order = await updateStatus(req.params.id, orderStatus);

    // 🔔 Real-time notification – status change pushed to the customer
    const notificationMessage = message || statusLabel(order.orderStatus);

    // Persist to DB
    await sendOrderMessage({
      userId: order.userId,
      orderId: order._id,
      message: notificationMessage
    });

    sendToUser(order.userId, {
      type: 'ORDER_STATUS_UPDATE',
      orderId: order._id,
      status: order.orderStatus,
      message: notificationMessage,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// CANCEL order (customer)
const cancelOrder = async (req, res) => {
  try {
    const order = await cancelUserOrder(req.params.id, req.user.id);

    // 🔔 Notify the customer their cancellation is confirmed
    const notificationMessage = `Order #${String(order._id).slice(-8).toUpperCase()} has been cancelled.`;

    // Persist to DB
    await sendOrderMessage({
      userId: req.user.id,
      orderId: order._id,
      message: notificationMessage
    });

    sendToUser(req.user.id, {
      type: 'ORDER_CANCELLED',
      orderId: order._id,
      status: 'cancelled',
      message: notificationMessage,
      timestamp: new Date().toISOString()
    });

    // 📢 Broadcast to ALL clients (admins see it on their dashboard)
    broadcast({
      type: 'ORDER_CANCELLED_BY_USER',
      orderId: order._id,
      userId: order.userId,
      message: `Customer cancelled order #${String(order._id).slice(-8).toUpperCase()}`,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET monthly revenue (admin)
const getMonthlyRevenue = async (req, res) => {
  try {
    const revenue = await calculateMonthlyRevenue();
    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getMonthlyRevenue
};