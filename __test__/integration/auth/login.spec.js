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

  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
    await Users.create(user);
  });

  it('should log user', async () => {
    const loggedInUser = {
      email: user.email,
      password: user.password
    };

    const res = await app()
      .post(LOGIN_URL)
      .send(loggedInUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toBeDefined();
  });

  it('should throw if email and password are not provided', async () => {
    const loggedInUser = {};

    const res = await app()
      .post(LOGIN_URL)
      .send(loggedInUser);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('email and password are required');
  });

  it('show throw an error if no user is found', async () => {
    const loggedInUser = {
      email: 'xpuram@gmail.com',
      password: '2begood4'
    };

    const res = await app()
      .post(LOGIN_URL)
      .send(loggedInUser);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid Credentials');
  });

  it('show throw an error if no user password is invalid', async () => {
    const loggedInUser = {
      email: user.email,
      password: '2begood444'
    };

    const res = await app()
      .post(LOGIN_URL)
      .send(loggedInUser);

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('Invalid Credentials');
  });

  afterAll(async () => {
    await closeDB();
  });
});
