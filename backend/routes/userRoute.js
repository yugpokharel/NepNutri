const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

// Register a new user
router.post('/register', userController.registerUser);

// TODO: Implement these routes in userController.js before enabling them
// router.get('/:id', userController.getUserById);   // Get user details
// router.put('/:id', userController.updateUser);    // Update user details
// router.delete('/:id', userController.deleteUser); // Delete user

module.exports = router;
