/**
 * @jest-environment node
 */

/* eslint-disable no-undef */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../../../models/Users');
const { connectDB, closeDB } = require('../utils/mongoose');

describe('The Users Model', () => {
  const user = {
    name: 'puram calvin',
    email: 'zpuram@gmail.com',
    password: '2begood4',
    passwordConfirm: '2begood4'
  };

  let currentUser;

  beforeAll(async () => {
    await connectDB();
    await Users.deleteMany();
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

  describe('JWT Token Method', () => {
    it('should send JWT Token to user after registration', async () => {
      const token = await currentUser.jwtToken();
      const { id } = jwt.verify(token, process.env.JWT_SECERT);

      expect(id).toEqual(JSON.parse(JSON.stringify(currentUser._id)));
    });
  });

  describe('The Compare Password Method', () => {
    it('should compare the candidate password and pasword in the database', async () => {
      const loginUser = {
        email: user.email,
        password: user.password
      };

      const verifyUser = await Users.findOne({ email: loginUser.email }).select(
        '+password'
      );

      const verifiedPassword = await verifyUser.comparePassword(
        loginUser.password,
        verifyUser.password
      );

      expect(verifiedPassword).toBe(true);
    });
  });

  describe('The Forgot Password', () => {
    it('should be called when user forgot his password', async () => {
      const { email } = user;
      const checkUser = await Users.findOne({ email });
      await checkUser.createForgotPasswordToken();

      expect(checkUser.resetPasswordToken).toEqual(expect.any(String));
      // expect(checkUser.resetPasswordExpires).toBeGreaterThan(0);
    });
  });

  afterAll(async () => {
    await closeDB();
  });
});
