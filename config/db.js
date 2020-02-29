const mongoose = require('mongoose');
const envVar = require('./index');

const connectDB = async () => {
  try {
    const con = await mongoose.connect(envVar.mongobd_url, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log(`connected to database on ${con.connection.host}`);
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connectDB;
