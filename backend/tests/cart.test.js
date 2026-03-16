const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Cart = require('../models/Cart');
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const { expect } = chai;

chai.use(chaiHttp);

describe('Cart API', () => {
  let token;
  let userId;
  let menuItemId;

  beforeEach(async () => {
    await Cart.deleteMany({});
    await User.deleteMany({});
    await MenuItem.deleteMany({});
    await Category.deleteMany({});

    const userData = { name: 'Cart User', email: 'cart@example.com', password: 'password123', phone: '1234567890' };
    await chai.request(app).post('/api/auth/register').send(userData);
    
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'cart@example.com', password: 'password123' });
    
    token = loginRes.body.token;
    userId = loginRes.body.user.id;

    const cat = await Category.create({ categoryName: 'Sides' });
    const item = await MenuItem.create({
      name: 'Garlic Bread',
      description: 'Cheesy',
      price: 5,
      categoryId: cat._id
    });
    menuItemId = item._id;
  });

  describe('POST /api/cart/add', () => {
    it('should add an item to the cart', async () => {
      const res = await chai.request(app)
        .post('/api/cart')
        .set('Authorization', `Bearer ${token}`)
        .send({ itemId: menuItemId, name: 'Garlic Bread', price: 5, quantity: 2 });

      expect(res).to.have.status(200);
      expect(res.body.cart.totalAmount).to.equal(10);
      expect(res.body.cart.items.length).to.equal(1);
    });
  });

  describe('GET /api/cart', () => {
    it('should fetch user cart', async () => {
      await Cart.create({
        userId,
        items: [{ itemId: menuItemId, name: 'Garlic Bread', price: 5, quantity: 1 }],
        totalAmount: 5
      });

      const res = await chai.request(app)
        .get('/api/cart')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.items.length).to.equal(1);
    });
  });

  describe('PUT /api/cart/update', () => {
    it('should update item quantity', async () => {
      await Cart.create({
        userId,
        items: [{ itemId: menuItemId, name: 'Garlic Bread', price: 5, quantity: 1 }],
        totalAmount: 5
      });

      const res = await chai.request(app)
        .put('/api/cart/update-quantity')
        .set('Authorization', `Bearer ${token}`)
        .send({ itemId: menuItemId, quantity: 3 });

      expect(res).to.have.status(200);
      expect(res.body.cart.items[0].quantity).to.equal(3);
      expect(res.body.cart.totalAmount).to.equal(15);
    });
  });

  describe('DELETE /api/cart/remove/:itemId', () => {
    it('should remove an item from the cart', async () => {
      await Cart.create({
        userId,
        items: [{ itemId: menuItemId, name: 'Garlic Bread', price: 5, quantity: 1 }],
        totalAmount: 5
      });

      const res = await chai.request(app)
        .delete(`/api/cart/${menuItemId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.cart.items.length).to.equal(0);
    });
  });
});
