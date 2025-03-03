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

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().trim().required()
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
    activityLevel = "moderate",
    bodyFatPercentage = null,
    weightLossRate = "moderate",
    dietaryPreference = "standard", // New parameter
  } = data

  // Convert height to centimeters
  const heightCm = heightFeet * 30.48 + heightInches * 2.54
  const weightKg = currentWeight

  // Mifflin-St Jeor BMR calculation
  let bmr
  if (gender === "Male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161
  }

  // Activity multipliers based on activity level
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  }

  const multiplier = activityMultipliers[activityLevel] || 1.55
  const tdee = bmr * multiplier

  // Calculate weight loss deficit based on desired rate and current weight
  const calculateWeightLossDeficit = () => {
    const baseDeficitPercentage =
      {
        slow: 0.15,
        moderate: 0.2,
        aggressive: 0.25,
      }[weightLossRate] || 0.2

    const calculatedDeficit = tdee * baseDeficitPercentage
    const maxDeficit = 1000

    return Math.min(calculatedDeficit, maxDeficit)
  }

  // Adjust calories based on goal
  let dailyCalories
  switch (goalType) {
    case "weight_loss":
      const deficit = calculateWeightLossDeficit()
      dailyCalories = tdee - deficit
      break
    case "weight_gain":
      // Adjust surplus based on current weight
      const surplusPercentage = Math.max(0.05, 0.15 - (weightKg - 70) * 0.002)
      dailyCalories = tdee * (1 + surplusPercentage)
      break
    case "muscle_gain":
      // Slightly higher surplus for dedicated muscle building
      const muscleSurplusPercentage = Math.max(0.07, 0.17 - (weightKg - 70) * 0.002)
      dailyCalories = tdee * (1 + muscleSurplusPercentage)
      break
    case "maintain":
      dailyCalories = tdee
      break
    default:
      dailyCalories = tdee
  }

  // Minimum calorie safety net based on gender and height
  const minCalories = gender === "Female" ? Math.max(1200, 10 * heightCm * 0.1) : Math.max(1500, 10 * heightCm * 0.12)

  dailyCalories = Math.max(dailyCalories, minCalories)

  // Calculate protein based on body weight, goal, and lean mass if available
  const calculateProteinGrams = () => {
    let proteinMultiplier
    if (bodyFatPercentage !== null) {
      const leanMass = weightKg * (1 - bodyFatPercentage / 100)
      proteinMultiplier = goalType === "weight_loss" ? 2.4 : goalType === "muscle_gain" ? 2.2 : 2.0
      return leanMass * proteinMultiplier
    } else {
      proteinMultiplier = goalType === "weight_loss" ? 2.2 : goalType === "muscle_gain" ? 2.0 : 1.8
      return weightKg * proteinMultiplier
    }
  }

  // Calculate macros based on goal, protein needs, and dietary preference
  const proteinGrams = calculateProteinGrams()
  const proteinCalories = proteinGrams * 4

  // Adjust fat and carb ratios based on dietary preference
  let fatsPercentage, carbsPercentage
  switch (dietaryPreference) {
    case "low-carb":
      fatsPercentage = 0.4
      carbsPercentage = 1 - proteinCalories / dailyCalories - fatsPercentage
      break
    case "keto":
      fatsPercentage = 0.7
      carbsPercentage = 0.05
      break
    default: // standard
      fatsPercentage = goalType === "weight_loss" ? 0.35 : 0.3
      carbsPercentage = 1 - proteinCalories / dailyCalories - fatsPercentage
  }

  const fatCalories = dailyCalories * fatsPercentage
  const fatsGrams = fatCalories / 9

  const carbsCalories = dailyCalories * carbsPercentage
  const carbsGrams = carbsCalories / 4

  // Calculate fiber recommendation
  const calculateFiberGrams = () => {
    const baseRecommendation = 14 * (dailyCalories / 1000)
    return Math.min(baseRecommendation, 50) // Cap at 50g
  }

  // Calculate water intake recommendation
  const calculateWaterIntake = () => {
    const baseWater = weightKg * 0.033 // 33ml per kg of body weight
    const activityAddition =
      {
        sedentary: 0,
        light: 0.2,
        moderate: 0.4,
        active: 0.6,
        veryActive: 0.8,
      }[activityLevel] || 0.4
    return baseWater + activityAddition
  }

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
    },
    fiber: Math.round(calculateFiberGrams()),
    waterIntake: Math.round(calculateWaterIntake() * 10) / 10, // Round to 1 decimal place
  }
}





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

//reset pass
exports.forgotPassword = async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email } = req.body;
    const user = await User.findOne({ where: { email: email.trim() } });

    let tempPassword;
    if (user) {
      // Generate temporary password
      tempPassword = Math.random().toString(36).slice(-8);
      const hashedTempPassword = encryptPassword(tempPassword);

      // Update user with temporary password
      await user.update({
        password: hashedTempPassword
      });

      // Configure email transport
      const transporter = nodemailer.createTransport({
        service: "gmail", // You can use other services like SendGrid, Mailgun, etc.
        auth: {
          user: process.env.EMAIL_USER, // Your email address
          pass: process.env.EMAIL_PASS, // Your email password or app-specific password
        },
      });

      // Email content
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "NepNutri Temporary Password",
        html: `
          <h2>Your Temporary Password</h2>
          <p>Use this temporary password to log in to your NepNutri account:</p>
          <p><strong>${tempPassword}</strong></p>
          <p>Please log in and change your password immediately after using this temporary password.</p>
          <p>If you didn't request this, please contact our support team.</p>
        `,
      };

      // Send email
      await transporter.sendMail(mailOptions);
      console.log(`Temporary password sent to ${email}: ${tempPassword}`);
    }

    // Always return success to prevent email enumeration
    return res.status(200).json({
      success: true,
      message: "If the email exists, a temporary password has been sent.",
    });
  } catch (error) {
    console.log("--forgot password error--->", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
      errors: error?.message,
    });
  }
};