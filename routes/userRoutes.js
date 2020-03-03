const express = require('express');

const router = express.Router();
const authController = require('../controller/authController.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/password/forgot', authController.forgotPassword);
router.patch('/password/reset', authController.resetPassword);
router.patch('/email/confirm', authController.confirmAccount);
router.post(
  '/email/resend',
  authController.protect,
  authController.resendEmailConfirm
);

module.exports = router;
