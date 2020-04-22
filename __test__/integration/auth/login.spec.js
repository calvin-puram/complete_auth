/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */

const supertest = require('supertest');

const { connectDB, closeDB } = require('../../server/utils/mongoose');
const Users = require('../../../models/Users');
const server = require('../../../app');

const app = () => supertest(server);
const LOGIN_URL = '/api/v1/auth/login';

describe('The Login Process', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let loggedInUser = {
    email: user.email,
    password: user.password
  };

  let request;
  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
    await Users.create(user);
    request = () => {
      return app()
        .post(LOGIN_URL)
        .send(loggedInUser);
    };
  });

  afterAll(async () => {
    await closeDB();
  });

  it('should log user', async () => {
    const res = await request();

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  it('should throw if email and password are not provided', async () => {
    loggedInUser = {};

    const res = await request();

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('email and password are required');
  });

  it('show throw an error if no user is found', async () => {
    loggedInUser = {
      email: 'xpuram@gmail.com',
      password: '2begood4'
    };

    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid Credentials');
  });

  it('show throw an error if  user password is invalid', async () => {
    loggedInUser = {
      email: user.email,
      password: '2begood444'
    };

    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid Credentials');
  });
});
