const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Order = require('../models/Order');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const { expect } = chai;

chai.use(chaiHttp);

describe('Orders API', () => {
  let token;
  let userId;
  let menuItemId;
  let addressId;

  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    await Address.deleteMany({});
    await Cart.deleteMany({});

    // Create user and get token
    const userData = { name: 'Tester', email: 'tester@example.com', password: 'password123', phone: '1234567890' };
    await chai.request(app).post('/api/auth/register').send(userData);
    
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'tester@example.com', password: 'password123' });
    
    token = loginRes.body.token;
    userId = loginRes.body.user.id;

    // Create Address
    const addr = await Address.create({
      userId: userId,
      houseNumber: 'Plot 7',
      street: 'Pizza Avenue',
      city: 'Cheesetown',
      state: 'NY',
      pincode: '10001',
      isDefault: true
    });
    addressId = addr._id;

    // Create category and menu item
    const cat = await Category.create({ categoryName: 'Pizzas' });
    const item = await MenuItem.create({
      name: 'Margherita',
      description: 'Classic',
      price: 12,
      categoryId: cat._id
    });
    menuItemId = item._id;
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      // 1. First add item to cart (or directly create cart record)
      await Cart.create({
        userId: userId,
        items: [{ itemId: menuItemId, name: 'Margherita', price: 12, quantity: 2 }],
        totalAmount: 24
      });

      // 2. Place order
      const orderData = {
        addressId: addressId,
        deliveryMode: 'delivery',
        paymentMethod: 'card'
      };

      const res = await chai.request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${token}`)
        .send(orderData);

      // 3. Verification
      // Subtotal 24 + Tax (5% of 24 = 1) + Delivery (40) = 65
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message').eql('Order placed successfully');
      expect(res.body.order).to.have.property('orderStatus').eql('pending');
      expect(res.body.order).to.have.property('totalAmount').eql(65);
    });
  });

  describe('GET /api/orders/my-orders', () => {
    it('should fetch user orders', async () => {
      // Manually create an order
      await Order.create({
        userId: userId,
        addressId: addressId,
        items: [{ itemId: menuItemId, name: 'Margherita', price: 12, quantity: 1 }],
        subtotal: 12,
        tax: 1,
        deliveryCharge: 2,
        totalAmount: 15,
        paymentMethod: 'cod',
        orderStatus: 'pending'
      });

      const res = await chai.request(app)
        .get('/api/orders/my-orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
      expect(res.body[0]).to.have.property('totalAmount').eql(15);
    });
  });
});
