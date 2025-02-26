const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../database/db");
const Joi = require("joi");

const userschema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  goals: Joi.array().items(Joi.string().trim().min(2).max(100)).required(),
  barriers: Joi.array().items(Joi.string().trim().min(2).max(100)).optional(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  age: Joi.number().integer().min(1).max(120).required(),
  country: Joi.string().trim().min(2).max(50).required(),
  heightFeet: Joi.number().integer().min(1).max(8).required(),
  heightInches: Joi.number().integer().min(0).max(11).required(),
  goalType: Joi.string()
    .valid("weight_loss", "weight_gain", "muscle_gain", "maintain")
    .required(),
  currentWeight: Joi.number().precision(2).min(0).max(1000).required(),
  goalWeight: Joi.number().precision(2).min(0).max(1000).required(),
  email: Joi.string().email().trim().required(),
  password: Joi.string().min(8).max(50).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().required(),
  password: Joi.string().required(),
});

const encryptPassword = (password) => {
  return bcrypt.hashSync(password, 12);
};

exports.registerUser = async (req, res) => {
  try {
    console.log("req.body--->", req.body);

    const validate = await userschema.validateAsync(req.body);

    const findUser = await User.findOne({
      where: { email: req.body.email.trim() },
    });
    if (findUser) {
      return res.status(409).json({
        success: false,
        message: `User already exists with email: ${req.body.email}`,
      });
    }

    // Hash password before saving
    // const hashedPassword = encryptPassword(req.body.password);
    const newUser = await User.create(req.body);

    const { password, ...rest } = newUser.toJSON();

    console.log("db:password--->", password);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: rest,
    });
  } catch (error) {
    console.log("--error--->", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      errors: error?.message,
      data: null,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    console.log("login req.body--->", req.body);

    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email: email.trim() },
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }
    console.log("here--->", password, user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("isMatch->", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // req.session.userId = user.id;

    // const { password: pwd, ...userData } = user.toJSON();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    console.log("--login error--->", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
      errors: error?.message,
      data: null,
    });
  }
};

const calculateCaloriesAndMacros = (data) => {
  const { gender, age, heightFeet, heightInches, currentWeight, goalType } =
    data;

  // Convert height to centimeters
  const heightCm = heightFeet * 30.48 + heightInches * 2.54;
  const weightKg = currentWeight;

  // Mifflin-St Jeor BMR calculation
  let bmr;
  if (gender === "Male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  // Assume moderate activity (1.55 multiplier)
  const tdee = bmr * 1.55;

  // Adjust calories based on goal
  let dailyCalories;
  switch (goalType) {
    case "weight_loss":
      dailyCalories = tdee - 500;
      break;
    case "weight_gain":
      dailyCalories = tdee + 500;
      break;
    case "muscle_gain":
      dailyCalories = tdee + 250;
      break;
    case "maintain":
      dailyCalories = tdee;
      break;
    default:
      dailyCalories = tdee;
  }

  // Minimum calorie safety net
  dailyCalories = Math.max(dailyCalories, gender === "Female" ? 1200 : 1500);

  // Macro ratios based on goal
  let proteinPercentage, carbsPercentage, fatsPercentage;
  switch (goalType) {
    case "weight_loss":
      proteinPercentage = 0.4;
      carbsPercentage = 0.3;
      fatsPercentage = 0.3;
      break;
    case "weight_gain":
    case "muscle_gain":
      proteinPercentage = 0.3;
      carbsPercentage = 0.4;
      fatsPercentage = 0.3;
      break;
    case "maintain":
      proteinPercentage = 0.35;
      carbsPercentage = 0.35;
      fatsPercentage = 0.3;
      break;
    default:
      proteinPercentage = 0.35;
      carbsPercentage = 0.35;
      fatsPercentage = 0.3;
  }

  const proteinGrams = (dailyCalories * proteinPercentage) / 4;
  const carbsGrams = (dailyCalories * carbsPercentage) / 4;
  const fatsGrams = (dailyCalories * fatsPercentage) / 9;

  return {
    calories: Math.round(dailyCalories),
    macros: {
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbsGrams),
      fats: Math.round(fatsGrams),
    },
  };
};

exports.calculateUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "user not found",
        data: null,
      });
    }

    console.log(email);

    const findUser = await User.findOne({ where: { email } });
    if (!findUser) {
      return res.status(404).json({
        message: "user not found",
        data: null,
      });
    }
    const result = calculateCaloriesAndMacros(findUser);
    return res.status(200).json({
      message: "New Goal",
      data: result,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: "user not found",
      data: null,
    });
  }
};
