/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

dotenv.config({ path: './.env' });
const Users = require('../../../models/Users');
const connectDB = require('../../../config/db');
const protect = require('../../../middleware/protect');
const AppError = require('../../../utils/custormError');

class Response {
  status(status) {
    this.status = status;
    return this;
  }

  data(data) {
    return data;
  }
}

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
    currentUser = await Users.create(user);
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
  });

  it('should throw error if no token', async () => {
    const req = {
      headers: {
        authorization: ''
      }
    };

    const res = new Response();

    const next = jest.fn();
    await protect(req, res, next);

    expect(next).toHaveBeenCalledWith(
      new AppError('you are not logged in', 401)
    );
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
