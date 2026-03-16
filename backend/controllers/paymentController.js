const { processPayment, getOrderPayment } = require('../services/paymentService');

// CREATE payment
const createPayment = async (req, res) => {
  try {
    const payment = await processPayment(req.user.id, req.body);
    res.status(201).json({
      message: 'Payment successful',
      payment
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET payment by order
const getPaymentByOrder = async (req, res) => {
  try {
    const payment = await getOrderPayment(req.params.orderId);
    res.status(200).json(payment);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { createPayment, getPaymentByOrder };