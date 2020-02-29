const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const envVar = require('../config/index');
const AppError = require('../utils/custormError');
const catchAsync = require('../utils/catchAsync');

const sendToken = async (user, res, statusCode) => {
  const token = jwt.sign({ id: user.id }, envVar.jwt_secret, {
    expiresIn: envVar.jwt_expires
  });

  res.status(statusCode).json({
    success: true,
    token,
    data: user
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
exports.login = (req, res, next) => {
  try {
    res.status(201).json({
      success: true,
      data: 'login'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      msg: err.msg
    });
  }
};
