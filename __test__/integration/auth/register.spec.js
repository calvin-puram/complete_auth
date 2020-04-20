/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

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
    const res = new Response();
    const next = jest.fn();

    await auth.register(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new AppError('all fields are required', 400)
    );
  });

  it('should throw error if email exist', async () => {
    const req = {
      body: user
    };
    const res = new Response();
    const next = jest.fn();

    await auth.register(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new AppError('user already registered', 400)
    );
  });

  afterAll(async () => {
    await closeDB();
  });
});
