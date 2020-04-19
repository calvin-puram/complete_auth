const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config({ path: './.env' });
const app = require('./app');

//connect to database
connectDB();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} & listening on PORT ${process.env.PORT}`
  );
});
