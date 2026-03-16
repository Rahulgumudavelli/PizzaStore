const Payment = require('../models/Payment');

const processPayment = async (userId, paymentData) => {
  const { orderId, paymentMode, paidAmount, transactionId } = paymentData;

  // Check if payment already exists for this order
  const existingPayment = await Payment.findOne({ orderId });
  if (existingPayment) {
    throw new Error('Payment already exists for this order');
  }

  const payment = await Payment.create({
    orderId,
    userId,
    paymentMode,
    paidAmount,
    transactionId: transactionId || '',
    paymentStatus: 'completed',
    paidAt: Date.now()
  });

  return payment;
};

const getOrderPayment = async (orderId) => {
  const payment = await Payment.findOne({ orderId })
    .populate('orderId')
    .populate('userId', 'name email');

  if (!payment) {
    throw new Error('Payment not found');
  }

  return payment;
};

module.exports = { processPayment, getOrderPayment };