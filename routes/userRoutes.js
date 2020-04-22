const express = require('express');

const router = express.Router();
const authController = require('../controller/authController.js');
const protect = require('../middleware/protect');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/password/forgot', authController.forgotPassword);
router.post('/password/reset', authController.resetPassword);
router.patch('/email/confirm', authController.confirmAccount);
router.post('/email/resend', protect, authController.resendEmailConfirm);

module.exports = router;
