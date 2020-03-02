/* eslint-disable node/no-unpublished-require */
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const envVar = require('../config/index');
const AppError = require('../utils/custormError');
const catchAsync = require('../utils/catchAsync');

const sendToken = async (user, res, statusCode) => {
  const token = jwt.sign({ id: user.id }, envVar.jwt_secret, {
    expiresIn: envVar.jwt_expires
  });

  user.password = undefined;
  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};

//@desc   Sign in Users
//@route  POST /api/auth/register
//@access public
exports.register = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('all fields are required', 400));
  }
  const user = await Users.create(req.body);

  sendToken(user, res, 201);
});

//@desc   Login Users
//@route  POST /api/auth/login
//@access public
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('email and password are required', 400));
  }

  const user = await Users.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError('Invalid Credentials', 401));
  }

  sendToken(user, res, 201);
});

//@desc   Forgot Password
//@route  POST /api/auth/password/forgot
//@access public
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await Users.findOne({ email });

  if (!user) {
    return next(new AppError('email not registered', 400));
  }

  await user.createForgotPasswordToken();

  res.status(200).json({
    success: true,
    msg: 'password reset link sent'
  });
});
