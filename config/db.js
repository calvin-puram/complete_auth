const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.MONGO_URI, {
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
