/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

// eslint-disable-next-line node/no-unpublished-require
const supertest = require('supertest');

const { connectDB, closeDB } = require('../../server/utils/mongoose');
const Users = require('../../../models/Users');
const server = require('../../../app');

const app = () => supertest(server);
const FORGOT_PASSWORD_URL = '/api/v1/auth/password/forgot';

describe('The Forgot Password Process', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  beforeEach(async () => {
    await connectDB();
    await Users.deleteMany();
  });

  it('should throw error if user email is not found', async () => {
    const req = {
      body: { email: user.email }
    };

    const res = await app()
      .post(FORGOT_PASSWORD_URL)
      .send(req.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error).toBe('email not registered');
  });

  it('should send reset token to user email ', async () => {
    await Users.create(user);
    const req = {
      body: { email: user.email }
    };

    const res = await app()
      .post(FORGOT_PASSWORD_URL)
      .send(req.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.msg).toBe('password reset link sent');

    const freshUser = await Users.findOne({ email: user.email });
    expect(freshUser.resetPasswordExpires).toBeDefined();
    expect(freshUser.resetPasswordToken).toBeDefined();
  });

  afterEach(async () => {
    await closeDB();
  });
});
