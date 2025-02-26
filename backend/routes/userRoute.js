const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// User registration route
router.post('/register', userController.registerUser);

// User login route
router.post('/login', userController.loginUser);

router.post('/calculate', userController.calculateUser);

module.exports = router;