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
const RESET_PASSWORD_URL = '/api/v1/auth/password/reset';

describe('The Reset Password Process', () => {
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

  it('should reset user password', async () => {
    const currentUser = await Users.create(user);
    const token = currentUser.jwtToken();
    const req = {
      body: {
        password: 'liv2lov',
        passwordConfirm: 'liv2lov',
        token
      }
    };

    const res = await app()
      .patch(RESET_PASSWORD_URL)
      .send(req.body);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.user.resetPasswordToken).toBeUndefined();
    expect(res.body.user.resetPasswordExpires).toBeUndefined();
  });

  afterEach(async () => {
    await closeDB();
  });
});
