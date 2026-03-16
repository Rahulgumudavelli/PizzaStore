const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentByOrder
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createPayment);
router.get('/:orderId', protect, getPaymentByOrder);

module.exports = router;