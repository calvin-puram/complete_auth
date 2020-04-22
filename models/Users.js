/* eslint-disable node/no-unpublished-require */
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const Mail = require('@fullstackjs/mail');

const UsersSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'Invalid Email'],
    lowercase: true
  },
  password: {
    type: String,
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
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
  createdAt: Date,
  wasNew: Boolean
});

UsersSchema.pre('save', async function(next) {
  this.wasNew = this.isNew;
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

UsersSchema.methods.jwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECERT, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

UsersSchema.methods.comparePassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UsersSchema.post('save', async function() {
  if (!this.isModified('email') && this.wasNew) {
    await this.sendEmailConfirm();
  }
});

UsersSchema.methods.sendEmailConfirm = async function() {
  return await new Mail('confirm-account')
    .to(this.email, this.name)
    .subject('confirm email')
    .data({
      url: `${process.env.BASE_URL}/emails/confirm/${this.emailConfirmCode}`,
      name: this.name
    })
    .send();
};

UsersSchema.methods.createForgotPasswordToken = async function() {
  const token = crypto.randomBytes(32).toString('hex');

  this.resetPasswordToken = token;

  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await new Mail('forgot-password')
    .to(this.email, this.name)
    .subject('Reset Password Link (expires in 10mins)')
    .data({
      url: `${process.env.BASE_URL}/resetPassword/${token}`,
      name: this.name
    })
    .send();
};

module.exports = mongoose.model('Users', UsersSchema);
