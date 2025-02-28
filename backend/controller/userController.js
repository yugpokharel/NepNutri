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
  const { 
    gender, 
    age, 
    heightFeet, 
    heightInches, 
    currentWeight, 
    goalType,
    activityLevel = "moderate", // New parameter with default
    bodyFatPercentage = null,   // Optional parameter
    weightLossRate = "moderate" // New parameter with default
  } = data;

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

  // Activity multipliers based on activity level
  const activityMultipliers = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725,       // Active - hard exercise 6-7 days/week
    veryActive: 1.9      // Very active - hard daily exercise & physical job
  };

  const multiplier = activityMultipliers[activityLevel] || 1.55;
  const tdee = bmr * multiplier;

  // Calculate weight loss deficit based on desired rate and current weight
  const calculateWeightLossDeficit = () => {
    // Base deficit on body weight (heavier individuals can handle larger deficits)
    const baseDeficitPercentage = {
      slow: 0.15,        // 15% deficit for slow, sustainable loss
      moderate: 0.20,    // 20% deficit for moderate loss
      aggressive: 0.25   // 25% deficit for faster loss
    }[weightLossRate] || 0.20;
    
    // Cap the deficit to ensure it's not too extreme
    const calculatedDeficit = tdee * baseDeficitPercentage;
    const maxDeficit = 1000; // Maximum 1000 calorie deficit
    
    return Math.min(calculatedDeficit, maxDeficit);
  };

  // Adjust calories based on goal
  let dailyCalories;
  switch (goalType) {
    case "weight_loss":
      const deficit = calculateWeightLossDeficit();
      dailyCalories = tdee - deficit;
      break;
    case "weight_gain":
      // Lean gaining approach - smaller surplus for less fat gain
      dailyCalories = tdee + 350;
      break;
    case "muscle_gain":
      // Slightly higher for dedicated muscle building
      dailyCalories = tdee + 450;
      break;
    case "maintain":
      dailyCalories = tdee;
      break;
    default:
      dailyCalories = tdee;
  }

  // Minimum calorie safety net based on gender and height
  const minCalories = gender === "Female" 
    ? Math.max(1200, 10 * heightCm * 0.1) 
    : Math.max(1500, 10 * heightCm * 0.12);
  
  dailyCalories = Math.max(dailyCalories, minCalories);

  // Calculate protein based on body weight and goal
  const calculateProteinGrams = () => {
    // Higher protein for weight loss to preserve muscle mass
    if (goalType === "weight_loss") {
      // Use body fat percentage if available for more accurate lean mass calculation
      if (bodyFatPercentage !== null) {
        const leanMass = weightKg * (1 - bodyFatPercentage / 100);
        return leanMass * 2.2; // 2.2g per kg of lean mass
      }
      return weightKg * 2.0; // 2.0g per kg of total weight
    } else if (goalType === "muscle_gain") {
      return weightKg * 1.8; // 1.8g per kg for muscle gain
    } else {
      return weightKg * 1.6; // 1.6g per kg for maintenance
    }
  };

  // Calculate macros based on goal and protein needs
  const proteinGrams = calculateProteinGrams();
  const proteinCalories = proteinGrams * 4;
  
  // Adjust fat and carb ratios based on goal
  let fatsPercentage;
  if (goalType === "weight_loss") {
    // Higher fat percentage for weight loss (helps with satiety)
    fatsPercentage = 0.35;
  } else {
    fatsPercentage = 0.30;
  }
  
  // Calculate remaining calories after protein
  const remainingCalories = dailyCalories - proteinCalories;
  
  // Calculate fat grams based on percentage of remaining calories
  const fatCalories = remainingCalories * fatsPercentage;
  const fatsGrams = fatCalories / 9;
  
  // Remaining calories go to carbs
  const carbsCalories = remainingCalories - fatCalories;
  const carbsGrams = carbsCalories / 4;

  return {
    calories: Math.round(dailyCalories),
    tdee: Math.round(tdee),
    bmr: Math.round(bmr),
    macros: {
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbsGrams),
      fats: Math.round(fatsGrams),
    },
    macroPercentages: {
      protein: Math.round((proteinCalories / dailyCalories) * 100),
      carbs: Math.round((carbsCalories / dailyCalories) * 100),
      fats: Math.round((fatCalories / dailyCalories) * 100),
    }
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
