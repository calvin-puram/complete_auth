const express = require('express');
const morgan = require('morgan');

const UserRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

app.use('/api/v1/auth', UserRouter);

module.exports = app;
