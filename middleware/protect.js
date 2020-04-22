const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users');

const catchAsync = require('../utils/catchAsync');

//@desc   protect route
//@route  middleware
module.exports = catchAsync(async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'you are not logged in'
    });
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECERT);

  // check if user exist
  const currentUser = await Users.findById(decode.id).select('+password');

  if (!currentUser) {
    return res.status(401).json({
      success: false,
      error: 'user no longer exist'
    });
  }

  req.user = currentUser;

  //authorize user
  next();
});
