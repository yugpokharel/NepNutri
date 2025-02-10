const User = require('../model/User');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    try {
      const { firstname, goal } = req.body;
  
      // Ensure first name is valid
      if (!firstname || !/^[A-Za-z\s]+$/.test(firstname.trim())) {
        return res.status(400).json({ message: "Invalid first name. Letters only." });
      }
  
      // Ensure goal is an array (if not, convert it to one)
      const userGoal = goal ? (Array.isArray(goal) ? goal : [goal]) : null;
  
      // Generate a dummy password hash
      const passwordHash = bcrypt.hashSync('dummyPassword', 10);
  
      // Create the user with firstname, goal, and password hash
      const newUser = await User.create({
        firstname,
        goal: userGoal, // Pass the goal directly (either single goal or array)
        password_hash: passwordHash,
      });
  
      res.status(201).json({
        message: "User created successfully",
        user: {
          firstname: newUser.firstname,
          goal: newUser.goal,
        },
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      res.status(500).json({ message: "An error occurred, please try again." });
    }
  };