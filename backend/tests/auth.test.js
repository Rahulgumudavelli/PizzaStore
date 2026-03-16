const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
const User = require('../models/User');
const { expect } = chai;

chai.use(chaiHttp);

describe('Auth API', () => {
  beforeEach(async () => {
    // Clear users before each test
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', (done) => {
      const user = {
        name: 'Test Member',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      };
      chai.request(app)
        .post('/api/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.a('object');
          expect(res.body).to.have.property('message').eql('User registered successfully');
          done();
        });
    });

    it('should not register a user with an existing email', async () => {
      const user = {
        name: 'Test Member',
        email: 'test@example.com',
        password: 'password123',
        phone: '1234567890'
      };
      await User.create(user);

      const res = await chai.request(app)
        .post('/api/auth/register')
        .send(user);
      
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').eql('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login an existing user', async () => {
      const user = {
        name: 'Test User',
        email: 'login@example.com',
        password: 'password123',
        phone: '9876543210'
      };
      // We need to register first because User model might hash password
      await chai.request(app).post('/api/auth/register').send(user);

      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
      expect(res.body.user).to.have.property('email').eql(user.email);
    });

    it('should return 400 for invalid credentials', async () => {
      const res = await chai.request(app)
        .post('/api/auth/login')
        .send({ email: 'nonexistent@example.com', password: 'wrongpassword' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').eql('Invalid email or password');
    });
  });
});
