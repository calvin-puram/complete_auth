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

  let currentUser;
  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
    currentUser = await Users.create(user);
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

  afterAll(async () => {
    await closeDB();
  });
});
