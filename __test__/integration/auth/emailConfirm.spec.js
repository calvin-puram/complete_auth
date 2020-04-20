/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const supertest = require('supertest');

const { connectDB, closeDB } = require('../../server/utils/mongoose');
const Users = require('../../../models/Users');
const server = require('../../../app');

const app = () => supertest(server);
const confirmEmailURL = '/api/v1/auth/email/confirm';

describe('The Email Confirm Process', () => {
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

  it('should throw error if user is not found with the token provided', async () => {
    const res = await app()
      .patch(confirmEmailURL)
      .send({ token: 'zxxcccxc' });

    expect(res.status).toBe(401);
  });

  it('should set confirm email to users account', async () => {
    const token = await currentUser.emailConfirmCode;

    const res = await app()
      .patch(confirmEmailURL)
      .send({ token });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
  });

  afterAll(async () => {
    await closeDB();
  });
});
