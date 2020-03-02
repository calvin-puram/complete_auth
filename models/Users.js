/* eslint-disable node/no-unpublished-require */
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Mail = require('@fullstackjs/mail');
const envVar = require('../config/index');

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
  passwordChangeAt: Date,
  createdAt: Date
});

UsersSchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;

  next();
});

UsersSchema.pre('save', function(next) {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailConfirmCode = token;

  this.createdAt = new Date();
  next();
});

UsersSchema.methods.comparePassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UsersSchema.post('save', async function() {
  try {
    return await new Mail('confirm-account')
      .to(this.email, this.name)
      .subject('confirm email')
      .data({
        url: `${envVar.base_url}/emails/confirm/${this.emailConfirmCode}`,
        name: this.name
      })
      .send();
  } catch (err) {
    console.log(err);
  }
});

UsersSchema.methods.createForgotPasswordToken = async function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await new Mail('forgot-password')
    .to(this.email, this.name)
    .subject('Reset Password Link (expires in 10mins)')
    .data({
      url: `${envVar.base_url}/resetPassword/${token}`,
      name: this.name
    })
    .send();
};

module.exports = mongoose.model('Users', UsersSchema);
