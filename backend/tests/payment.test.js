const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');
const Address = require('../models/Address');
const { expect } = chai;

chai.use(chaiHttp);

describe('Payment API', () => {
  let token;
  let userId;
  let orderId;

  beforeEach(async () => {
    await Payment.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Address.deleteMany({});

    const userData = { name: 'Pay User', email: 'pay@example.com', password: 'password123', phone: '1234567890' };
    await chai.request(app).post('/api/auth/register').send(userData);
    const loginRes = await chai.request(app).post('/api/auth/login').send({ email: 'pay@example.com', password: 'password123' });
    token = loginRes.body.token;
    userId = loginRes.body.user.id;

    const addr = await Address.create({ userId, houseNumber: '1', street: 'S', city: 'C', state: 'ST', pincode: 'P' });
    const order = await Order.create({
      userId,
      addressId: addr._id,
      items: [{ itemId: userId, name: 'P', price: 1, quantity: 1 }],
      subtotal: 1, tax: 0, deliveryCharge: 0, totalAmount: 1, paymentMethod: 'card'
    });
    orderId = order._id;
  });

  describe('POST /api/payments', () => {
    it('should process a payment', async () => {
      const res = await chai.request(app)
        .post('/api/payments')
        .set('Authorization', `Bearer ${token}`)
        .send({ orderId, paymentMode: 'card', paidAmount: 1, transactionId: 'TX_WEB' });

      expect(res).to.have.status(201);
      expect(res.body.message).to.equal('Payment successful');
    });
  });

  describe('GET /api/payments/:orderId', () => {
    it('should get payment for an order', async () => {
      await Payment.create({ orderId, userId, paidAmount: 1, paymentMode: 'card', paymentStatus: 'completed', transactionId: 'TX123' });
      const res = await chai.request(app).get(`/api/payments/${orderId}`).set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body.transactionId).to.equal('TX123');
    });
  });
});
