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
const RESET_PASSWORD_URL = '/api/v1/auth/password/reset';

describe('The Forgot Password Process', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };
  const data = {
    password: 'liv2lovv',
    passwordConfirm: 'liv2lovv',
    token: ''
  };

  const forgotEmail = {
    email: user.email
  };
  let freshUser;
  let request;
  beforeEach(async () => {
    await connectDB();
    await Users.deleteMany();
    request = (url, userData) => {
      return app()
        .post(url)
        .send(userData);
    };
  });
  afterEach(async () => {
    await closeDB();
  });

  it('should throw error if user email is not found', async () => {
    const res = await request(FORGOT_PASSWORD_URL, forgotEmail);

    expect(res.status).toBe(400);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error).toBe('email not registered');
  });

  it('should send reset token to user email and update user password', async () => {
    //send reset token
    await Users.create(user);

    const res = await request(FORGOT_PASSWORD_URL, forgotEmail);

    expect(res.status).toBe(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.msg).toBe('password reset link sent');

    freshUser = await Users.findOne({ email: user.email });
    expect(freshUser.resetPasswordExpires).toBeDefined();
    expect(freshUser.resetPasswordToken).toBeDefined();

    //update user pasword
    data.token = freshUser.resetPasswordToken;
    const response = await request(RESET_PASSWORD_URL, data);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.user.resetPasswordToken).toBeUndefined();
    expect(response.body.user.resetPasswordExpires).toBeUndefined();
  });

  describe('The Reset Password Process', () => {
    it('should throw error if token has expired or invalid', async () => {
      await Users.create(user);
      data.token = '50efa3323dc0cb08c';

      const res = await request(RESET_PASSWORD_URL, data);

      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalsy();
      expect(res.body.error).toBe('invalid credentials or token has expired');
    });

    it('should throw error if no user is found', async () => {
      data.token = '50efa3323dc0cb08c';

      const res = await request(RESET_PASSWORD_URL, data);

      expect(res.status).toBe(401);
      expect(res.body.success).toBeFalsy();
      expect(res.body.error).toBe('invalid credentials or token has expired');
    });
  });
});
