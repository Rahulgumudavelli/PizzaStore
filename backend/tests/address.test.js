const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const Address = require('../models/Address');
const User = require('../models/User');
const { expect } = chai;

chai.use(chaiHttp);

describe('Address API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await Address.deleteMany({});
    await User.deleteMany({});

    const userData = { name: 'Addr User', email: 'addr@example.com', password: 'password123', phone: '1234567890' };
    await chai.request(app).post('/api/auth/register').send(userData);
    
    const loginRes = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'addr@example.com', password: 'password123' });
    
    token = loginRes.body.token;
    userId = loginRes.body.user.id;
  });

  describe('POST /api/address', () => {
    it('should add a new address', async () => {
      const addrData = {
        houseNumber: '101',
        street: 'Main St',
        city: 'Metropolis',
        state: 'NY',
        pincode: '10001',
        isDefault: true
      };

      const res = await chai.request(app)
        .post('/api/address')
        .set('Authorization', `Bearer ${token}`)
        .send(addrData);

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('city').eql('Metropolis');
      expect(res.body).to.have.property('isDefault').eql(true);
    });
  });

  describe('GET /api/address', () => {
    it('should fetch user addresses', async () => {
      await Address.create({
        userId,
        houseNumber: '102',
        street: 'Second St',
        city: 'Gotham',
        state: 'NJ',
        pincode: '07001'
      });

      const res = await chai.request(app)
        .get('/api/address')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
    });
  });

  describe('PUT /api/address/:id', () => {
    it('should update an address', async () => {
      const addr = await Address.create({
        userId,
        houseNumber: '201',
        street: 'Third St',
        city: 'Star City',
        state: 'CA',
        pincode: '90001'
      });

      const res = await chai.request(app)
        .put(`/api/address/${addr._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ city: 'Central City' });

      expect(res).to.have.status(200);
      expect(res.body.city).to.equal('Central City');
    });
  });

  describe('DELETE /api/address/:id', () => {
    it('should delete an address', async () => {
      const addr = await Address.create({
        userId,
        houseNumber: '301',
        street: 'Fourth St',
        city: 'Coast City',
        state: 'WA',
        pincode: '98001'
      });

      const res = await chai.request(app)
        .delete(`/api/address/${addr._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Address deleted successfully');
    });
  });
});
