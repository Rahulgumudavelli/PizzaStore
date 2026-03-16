const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const User = require('../models/User');
const { expect } = chai;

chai.use(chaiHttp);

describe('User API', () => {
  let token;
  let adminToken;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});

    // Regular User
    const userData = { name: 'Regular User', email: 'user@example.com', password: 'password123', phone: '1234567890' };
    await chai.request(app).post('/api/auth/register').send(userData);
    const loginRes = await chai.request(app).post('/api/auth/login').send({ email: 'user@example.com', password: 'password123' });
    token = loginRes.body.token;
    userId = loginRes.body.user.id;

    // Admin User
    const adminData = { name: 'Admin', email: 'admin@example.com', password: 'adminpassword', phone: '0000000000', role: 'admin' };
    await chai.request(app).post('/api/auth/register').send(adminData);
    const adminLoginRes = await chai.request(app).post('/api/auth/login').send({ email: 'admin@example.com', password: 'adminpassword' });
    adminToken = adminLoginRes.body.token;
  });

  describe('GET /api/users/profile', () => {
    it('should fetch user profile', async () => {
      const res = await chai.request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.email).to.equal('user@example.com');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update user profile', async () => {
      const res = await chai.request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Name', phone: '1111111111' });

      expect(res).to.have.status(200);
      expect(res.body.user.name).to.equal('Updated Name');
    });
  });

  describe('GET /api/users (Admin Only)', () => {
    it('should allow admin to fetch all users', async () => {
      const res = await chai.request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });

    it('should deny non-admin access to fetch all users', async () => {
      const res = await chai.request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      // Assuming there is a role check middleware that returns 403 or 401
      expect(res).to.have.status(403);
    });
  });
});
