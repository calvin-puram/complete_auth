/* eslint-disable node/no-unpublished-require */
const { promisify } = require('util');
const crypto = require('crypto');
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
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    msg: 'password reset link sent'
  });
});

//@desc   Reset Password
//@route  POST /api/auth/password/reset
//@access public
exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, token } = req.body;
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await Users.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  }).select('+password');

  if (!user) {
    return next(new AppError('invalid credentials or token has expired', 401));
  }

  try {
    user.password = password;
    user.passwordConfirm = passwordConfirm;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  sendToken(user, res, 200);
});

//@desc   Confirm Account
//@route  PUT /api/auth/email/confirm
//@access public
exports.confirmAccount = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  const currentUser = await Users.findOne({ emailConfirmCode: token });

  if (!currentUser) {
    return next(new AppError('invalid credentials', 401));
  }

  const user = await Users.findByIdAndUpdate(
    { _id: currentUser._id },
    {
      emailConfirmCode: null,
      emailConfirmDate: Date.now()
    },
    { new: true }
  );

  sendToken(user, res, 200);
});

//@desc   protect route
//@route  middleware
exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('you are not logged in', 401));
  }

  const decode = await promisify(jwt.verify)(token, envVar.jwt_secret);

  // check if user exist
  const currentUser = await Users.findById(decode.id).select('+password');

  if (!currentUser) {
    return next(new AppError('user no longer exist', 401));
  }

  req.user = currentUser;

  //authorize user
  next();
});

//@desc   Resend Confirm Password
//@route  Post /api/auth/email/resend
//@access Private
exports.resendEmailConfirm = catchAsync(async (req, res, next) => {
  if (!req.user.emailConfirmDate) {
    await req.user.sendEmailConfirm();
  }

  res.status(200).json({
    success: true,
    msg: 'confirm email sent'
  });
});
