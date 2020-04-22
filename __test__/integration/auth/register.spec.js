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
const REGISTER_URL = '/api/v1/auth/register';

describe('The Registration Process', () => {
  let user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let request;
  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
    request = () => {
      return app()
        .post(REGISTER_URL)
        .send(user);
    };
  });
  afterAll(async () => {
    await closeDB();
  });

  it('should register a user', async () => {
    const response = await request();

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  it('should throw error if email exist', async () => {
    const res = await request();

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('user already registered');
  });

  it('should throw error if fields are empty', async () => {
    user = {};

    const res = await request();

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe('all fields are required');
  });
});
