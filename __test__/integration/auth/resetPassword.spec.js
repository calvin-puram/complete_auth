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

  it('should throw error if token has expired or invalid', async () => {
    await Users.create(user);
    const token = '50efa3323dc0cb08c';
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

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error).toBe('invalid credentials or token has expired');
  });

  afterEach(async () => {
    await closeDB();
  });
});
