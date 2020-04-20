// eslint-disable-next-line node/no-unpublished-require
const AppError = require('../utils/custormError');

//handleDuplicate
const handleDuplicate = () => {
  const message = `duplicate value enter for email `;
  return new AppError(message, 400);
};

//handleValidation
const handleValidation = err => {
  const message = Object.values(err.errors).join(', ');
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err.message
    // stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      msg: err.message
    });
  } else {
    console.log(err);
    res.status(500).json({
      success: false,
      msg: 'Internal Server Error'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    // handleDuplicate
    if (error.code === 11000) error = handleDuplicate(error);
    // handleValidationError
    if (error.name === 'ValidationError') error = handleValidation(error);

    sendErrorProd(error, res);
  }
};
