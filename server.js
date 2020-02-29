const dotenv = require('dotenv');
const envVar = require('./config/index');
const connectDB = require('./config/db');

dotenv.config({ path: './.env' });
const app = require('./app');

//connect to database
connectDB();

const PORT = envVar.port;

app.listen(PORT, () => {
  console.log(
    `server running in ${envVar.node_env} & listening on port ${envVar.port}`
  );
});
