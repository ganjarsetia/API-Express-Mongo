import supertest from 'supertest';
import app from '../../config/express';
import User from '../../user/user.model';
import setupDB from '../setup';
const request = supertest(app);

setupDB('db_auth');

describe('Auth - login - /api/auth/login', () => {
  beforeAll(async () => {
    // mongodb connection -> create user
    await request.post('/api/users').send({
      email: 'testemail@test.com',
      password: 'password',
      confirmPassword: 'password',
      username: 'name name',
      mobileNumber: '5656565656'
    });
  });

  afterAll(async () => {
    // remove all users and close
    await User.remove({});
  });

  test('POST - /api/auth/login - empty body', async done => {
    const response = await request.post('/api/auth/login');
    const { success, status, data } = response.body;
    expect(response.statusCode).toBe(400);
    expect(success).toBeFalsy();
    expect(status).toBe(400);
    expect(data).toHaveProperty('email');
    expect(data).toHaveProperty('password');
    done();
  });

  test('POST - /api/auth/login - no password', async done => {
    const response = await request
      .post('/api/auth/login')
      .send({ email: 'abc@testwrongemail.com' });
    const { success, status, data } = response.body;
    expect(response.statusCode).toBe(400);
    expect(success).toBeFalsy();
    expect(status).toBe(400);
    expect(data).toHaveProperty('password');
    done();
  });

  test('POST - /api/auth/login - no email', async done => {
    const response = await request.post('/api/auth/login').send({ password: 'abcd' });
    const { success, status, data } = response.body;
    expect(response.statusCode).toBe(400);
    expect(success).toBeFalsy();
    expect(status).toBe(400);
    expect(data).toHaveProperty('email');
    done();
  });

  test('POST - /api/auth/login - wrong email', async done => {
    const response = await request
      .post('/api/auth/login')
      .send({ email: 'fakeemail@com.com', password: 'abcd' });
    const { success, status, data } = response.body;
    expect(response.statusCode).toBe(404);
    expect(success).toBeFalsy();
    expect(status).toBe(404);
    expect(data).toHaveProperty('email');
    done();
  });

  test('POST - /api/auth/login - wrong password', async done => {
    const response = await request
      .post('/api/auth/login')
      .send({ email: 'testemail@test.com', password: 'fake-password' });
    const { success, status, data } = response.body;
    expect(response.statusCode).toBe(401);
    expect(success).toBeFalsy();
    expect(status).toBe(401);
    expect(data).toHaveProperty('msg');
    done();
  });

  test('POST - /api/auth/login - valid data - token', async done => {
    const response = await request
      .post('/api/auth/login')
      .send({ email: 'testemail@test.com', password: 'password' });
    const { success, status, data } = response.body;
    expect(response.statusCode).toBe(200);
    expect(success).toBeTruthy();
    expect(status).toBe(200);
    expect(data).toHaveProperty('token');
    done();
  });
});
