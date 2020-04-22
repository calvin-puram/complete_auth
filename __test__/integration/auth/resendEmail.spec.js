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
const RESEND_EMAIL_CONFIRM = '/api/v1/auth/email/resend';

describe('The Resend Email Confirm Process', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let currentUser;
  let request;
  let token;
  beforeEach(async () => {
    await connectDB();
    await Users.deleteMany();
    currentUser = await Users.create(user);
    request = () => {
      return app()
        .post(RESEND_EMAIL_CONFIRM)
        .set('authorization', token)
        .send();
    };
  });
  afterEach(async () => {
    await closeDB();
  });

  it('should throw error if user is not logged in', async () => {
    token = '';
    const res = await request();

    expect(res.status).toBe(401);
    expect(res.body.success).toBeFalsy();
    expect(res.body.error).toBe('you are not logged in');
  });

  it('should inform user that confirm message has been sent', async () => {
    token = await currentUser.jwtToken();

    const res = await request();

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.msg).toBe('confirm email sent');
  });
});
