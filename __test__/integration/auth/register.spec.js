/**
 * @jest-environment node
 */

/* eslint-disable no-undef */
/* eslint-disable node/no-unpublished-require */

const supertest = require('supertest');

const { connectDB, closeDB } = require('../../server/utils/mongoose');
const Users = require('../../../models/Users');
const server = require('../../../app');
const auth = require('../../../controller/authController');
const AppError = require('../../../utils/custormError');
const Response = require('../../server/utils/response');

const app = () => supertest(server);
const REGISTER_URL = '/api/v1/auth/register';

describe('The Registration Process', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
  });

  it('should register a user', async () => {
    const response = await app()
      .post(REGISTER_URL)
      .send(user);

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it('should throw error if fields are empty', async () => {
    const req = {
      body: {}
    };

    const res = await app()
      .post(REGISTER_URL)
      .send(req.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('all fields are required');
  });

  it('should throw error if email exist', async () => {
    const req = {
      body: user
    };

    const res = await app()
      .post(REGISTER_URL)
      .send(req.body);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('user already registered');
  });

  afterAll(async () => {
    await closeDB();
  });
});
