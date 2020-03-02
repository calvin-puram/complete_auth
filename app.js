const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const UserRouter = require('./routes/userRoutes');
const globalError = require('./controller/globallError');

const app = express();
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

app.use('/api/v1/auth', UserRouter);
app.use(globalError);

module.exports = app;
