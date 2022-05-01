const supertest = require('supertest');
const { createServer } = require('../server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

const app = createServer();

describe('user', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });
  let token = '';

  const users = {
    user1: {
      email: 'ramishook99@gmail.com',
      password: 'Rami@1234',
      repeat_password: 'Rami@1234',
      fullName: 'Rami Shook',
    },
    user2: {
      email: 'ramishook991@gmail.com',
      password: 'Rami@1234',
      repeat_password: 'Rami@1234',
      fullName: 'Rami Shook2',
    },
  };

  describe('user registration', () => {
    it('should get 201 on registeration', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/signup')
        .send(users.user1);

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('error', false);
    });
    it('should get 201 on registeration', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/signup')
        .send(users.user2);

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('error', false);
    });
  });

  describe('user registration', () => {
    it('should get 400 on missing field/s', async () => {
      const user = {
        email: 'ramishook99@gmail.com',
        password: 'Rami@1234',
        // noRepeatPassword
        fullName: 'Rami Shook',
      };

      const { statusCode, body } = await supertest(app)
        .post('/api/signup')
        .send(user);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('error', true);
    });
  });

  describe('user login', () => {
    it('should get 401 on wrong username or password', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/login')
        .send({ email: users.user1.email, password: 'any worng password' });
      expect(statusCode).toBe(401);
      expect(body).toHaveProperty('error', true);
      expect(body).toHaveProperty('message', 'Wrong email or password');
    });
  });

  describe('user login', () => {
    it('should get 200 on right username and password', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/login')
        .send({ email: users.user1.email, password: users.user1.password });
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('error', false);
      expect(body).toHaveProperty('accessToken');
      token = body.accessToken;
    });
  });

  describe('user info', () => {
    it('Since first signup should have role admin', async () => {
      const { statusCode, body } = await supertest(app)
        .get('/api/user')
        .set('Authorization', token)
        .send();
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('error', false);
      expect(body).toHaveProperty('user.role', 'admin');
    });
  });

  describe('user login', () => {
    it('should get 200 on right username and password', async () => {
      const { statusCode, body } = await supertest(app)
        .post('/api/login')
        .send({ email: users.user2.email, password: users.user2.password });
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('error', false);
      expect(body).toHaveProperty('accessToken');
      token = body.accessToken;
    });
  });

  describe('user info', () => {
    it('Since NOT first signup should have role user', async () => {
      const { statusCode, body } = await supertest(app)
        .get('/api/user')
        .set('Authorization', token)
        .send();
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('error', false);
      expect(body).toHaveProperty('user.role', 'user');
    });
  });
});
