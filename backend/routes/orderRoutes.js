const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getMonthlyRevenue
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/cancel/:id', protect, cancelOrder);

// Admin routes
router.get('/all', protect, adminOnly, getAllOrders);
router.put('/status/:id', protect, adminOnly, updateOrderStatus);
router.get('/revenue', protect, adminOnly, getMonthlyRevenue);

module.exports = router;