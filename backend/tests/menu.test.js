const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const { expect } = chai;

chai.use(chaiHttp);

describe('Menu & Categories API', () => {
  let categoryId;

  beforeEach(async () => {
    await MenuItem.deleteMany({});
    await Category.deleteMany({});
    
    const cat = await Category.create({ categoryName: 'Test Category' });
    categoryId = cat._id;
  });

  describe('GET /api/categories', () => {
    it('should fetch all categories', async () => {
      const res = await chai.request(app).get('/api/categories');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('categoryName').eql('Test Category');
    });
  });

  describe('GET /api/menu', () => {
    it('should fetch all menu items', async () => {
      await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test description',
        price: 10,
        categoryId: categoryId
      });

      const res = await chai.request(app).get('/api/menu');
      expect(res).to.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body[0]).to.have.property('name').eql('Test Pizza');
    });
  });
});
