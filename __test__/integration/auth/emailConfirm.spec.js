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
const confirmEmailURL = '/api/v1/auth/email/confirm';

describe('The Email Confirm Process', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let currentUser;
  let token;
  let request;
  beforeEach(async () => {
    await connectDB();
    await Users.deleteMany();
    currentUser = await Users.create(user);
    request = () => {
      return app()
        .patch(confirmEmailURL)
        .send({ token });
    };
  });
  afterEach(async () => {
    await closeDB();
  });

  it('should throw error if user is not found with the token provided', async () => {
    token = 'sghdjdhdsdsgs';
    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error).toBe('invalid credencials');
  });

  it('should set confirm email to users account', async () => {
    token = await currentUser.emailConfirmCode;

    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.emailConfirmCode).toBeNull();
    expect(res.body.user.emailConfirmDate).toBeDefined();
  });
});
