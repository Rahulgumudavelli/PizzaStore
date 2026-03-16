const Order = require('../models/Order');
const Cart = require('../models/Cart');

const placeOrder = async (userId, orderData) => {
  const { addressId, deliveryMode, paymentMethod } = orderData;

  // Get user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new Error('Cart is empty');
  }

  const subtotal = cart.totalAmount;
  const tax = Math.round(subtotal * 0.05);
  const deliveryCharge = deliveryMode === 'delivery' ? 40 : 0;
  const totalAmount = subtotal + tax + deliveryCharge;

  // Create order from cart
  const order = await Order.create({
    userId,
    addressId,
    items: cart.items,
    subtotal,
    tax,
    deliveryCharge,
    totalAmount,
    deliveryMode: deliveryMode || 'delivery',
    paymentMethod,
    paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending',
    orderStatus: 'pending'
  });

  // Clear cart after order placed
  await Cart.findOneAndDelete({ userId });

  return order;
};

const updateStatus = async (orderId, orderStatus) => {
  const order = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  );
  if (!order) {
    throw new Error('Order not found');
  }
  return order;
};

const cancelUserOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, userId });
  if (!order) {
    throw new Error('Order not found');
  }
  if (order.orderStatus !== 'pending') {
    throw new Error('Only pending orders can be cancelled');
  }
  order.orderStatus = 'cancelled';
  await order.save();
  return order;
};

const calculateMonthlyRevenue = async () => {
  const revenue = await Order.aggregate([
    { $match: { orderStatus: 'delivered' } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $count: {} },
        averageOrderValue: { $avg: '$totalAmount' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } }
  ]);
  return revenue;
};

module.exports = {
  placeOrder,
  updateStatus,
  cancelUserOrder,
  calculateMonthlyRevenue
};