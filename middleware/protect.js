const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');
const AppError = require('../utils/custormError');
const catchAsync = require('../utils/catchAsync');

//@desc   protect route
//@route  middleware
module.exports = catchAsync(async (req, res, next) => {
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

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECERT);

  // check if user exist
  const currentUser = await Users.findById(decode.id).select('+password');

  if (!currentUser) {
    return next(new AppError('user no longer exist', 401));
  }

  req.user = currentUser;

  //authorize user
  next();
});
