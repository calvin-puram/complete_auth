const express = require('express');

const router = express.Router();
const authController = require('../controller/authController.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/password/forgot', authController.forgotPassword);

module.exports = router;
