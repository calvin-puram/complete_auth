/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const supertest = require('supertest');

const { connectDB, closeDB } = require('../../server/utils/mongoose');
const Users = require('../../../models/Users');
const server = require('../../../app');

const app = () => supertest(server);

describe('The Registration Process', () => {
  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
  });

  it('should register a user', async () => {
    const response = await app()
      .post('/api/v1/auth/register')
      .send({
        name: 'puram calvin',
        email: 'cpuram@gmail.com',
        password: '2begood4',
        passwordConfirm: '2begood4'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  afterAll(async () => {
    await closeDB();
  });
});
