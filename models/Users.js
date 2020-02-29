const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UsersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'Invalid Email'],
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'please confirm your password'],
    validate: {
      validator: function(val) {
        return this.password === val;
      },
      message: 'password do not match'
    }
  },
  photo: String,
  emailConfirmCode: String,
  emailConfirmDate: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  passwordChangeAt: Date
});

UsersSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

UsersSchema.pre('save', function(next) {
  const token = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.emailConfirmCode = hashedToken;
  this.createdAt = new Date();
  next();
});

UsersSchema.methods.comparePassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('Users', UsersSchema);
