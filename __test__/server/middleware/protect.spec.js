/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const Users = require('../../../models/Users');
const protect = require('../../../middleware/protect');
const Response = require('../utils/response');
const { connectDB, closeDB } = require('../utils/mongoose');

describe('The Protect Auth Middleware', () => {
  const user = {
    name: 'puram calvin',
    email: 'cpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let currentUser;
  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
    currentUser = await Users.create(user);
  });
  afterAll(async () => {
    await closeDB();
  });

  it('should check if request token is valid and called next', async () => {
    const token = await currentUser.jwtToken();

    const req = {
      headers: {
        authorization: token
      }
    };

    const res = new Response();
    const next = jest.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });
});
