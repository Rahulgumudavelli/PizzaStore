const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Message = require('../models/Message');
const User = require('../models/User');
const Order = require('../models/Order');
const Address = require('../models/Address');
const { expect } = chai;

chai.use(chaiHttp);

describe('Message API', () => {
  let token;
  let userId;
  let orderId;

  beforeEach(async () => {
    await Message.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Address.deleteMany({});

    const userData = { name: 'Msg User', email: 'msg@example.com', password: 'password123', phone: '1234567890' };
    await chai.request(app).post('/api/auth/register').send(userData);
    const loginRes = await chai.request(app).post('/api/auth/login').send({ email: 'msg@example.com', password: 'password123' });
    token = loginRes.body.token;
    userId = loginRes.body.user.id;

    const addr = await Address.create({ userId, houseNumber: '1', street: 'S', city: 'C', state: 'ST', pincode: 'P' });
    const order = await Order.create({
      userId,
      addressId: addr._id,
      items: [{ itemId: userId, name: 'P', price: 1, quantity: 1 }],
      subtotal: 1, tax: 0, deliveryCharge: 0, totalAmount: 1, paymentMethod: 'cod'
    });
    orderId = order._id;
  });

  describe('GET /api/messages', () => {
    it('should fetch user messages', async () => {
      await Message.create({ userId, orderId, message: 'Test Msg' });
      const res = await chai.request(app).get('/api/messages/my-messages').set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
    });
  });

  describe('PUT /api/messages/:id/read', () => {
    it('should mark message as read', async () => {
      const msg = await Message.create({ userId, orderId, message: 'Test Msg' });
      const res = await chai.request(app).put(`/api/messages/${msg._id}/read`).set('Authorization', `Bearer ${token}`);
      expect(res).to.have.status(200);
      expect(res.body.data.isRead).to.equal(true);
    });
  });
});
