/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config({ path: './.env' });
const Users = require('../../../models/Users');
const connectDB = require('../../../config/db');

describe('The Users Model', () => {
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

  it('should hash the password before saving to database', async () => {
    expect(bcrypt.compareSync(user.password, currentUser.password)).toBe(true);
    expect(currentUser.passwordConfirm).toBeUndefined();
  });

  it('should create a confirm email code', async () => {
    // expect(currentUser.emailConfirmCode).not.toBeUndefined();
    expect(currentUser.emailConfirmCode).toEqual(expect.any(String));
  });

  describe('JWT Instance Method', () => {
    it('should send JWT Token to user after registration', async () => {
      const token = await currentUser.jwtToken();
      const { id } = jwt.verify(token, process.env.JWT_SECERT);
      console.log(typeof id, typeof JSON.stringify(currentUser._id));
      expect(id).toEqual(JSON.parse(JSON.stringify(currentUser._id)));
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
