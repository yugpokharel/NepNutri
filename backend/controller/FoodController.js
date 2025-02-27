import joi from "joi";
const { sequelize } = require("../database/db.js");

// Joi schema for validating food data
const foodSchema = object({
  name: joi.string().trim().min(2).max(100).required(),
  category: joi.string().trim().min(2).max(50).required(),
  calories: joi.number().integer().min(0).max(10000).required(),
  protein: joi.number().precision(1).min(0).max(999.9).required(),
  fat: joi.number().precision(1).min(0).max(999.9).required(),
  carbs: joi.number().precision(1).min(0).max(999.9).required(),
});

// Joi schema for search queries
const searchSchema = object({
  name: joi.string().trim().required(),
});

export async function searchFoods(req, res) {
  try {
    console.log("req.query--->", req.query);

    const { error } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name } = req.query;

    const foods = await findAll({
      where: sequelize.literal(`LOWER(name) LIKE LOWER('%${name}%')`),
    });

    return res.status(200).json({
      success: true,
      message: "Foods retrieved successfully",
      data: foods,
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
}

export async function addFood(req, res) {
  try {
    console.log("req.body--->", req.body);

    const { error } = foodSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { name, category, calories, protein, fat, carbs } = req.body;

    const findFood = await findOne({
      where: { name: name.trim() },
    });
    if (findFood) {
      return res.status(409).json({
        success: false,
        message: `Food item already exists with name: ${name}`,
      });
    }

    const newFood = await create({
      name: name.trim(),
      category: category.trim(),
      calories,
      protein,
      fat,
      carbs,
    });

    return res.status(201).json({
      success: true,
      message: "Food item created successfully",
      data: newFood,
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
}

export async function getAllFoods(req, res) {
  try {
    const foods = await findAll();

    return res.status(200).json({
      success: true,
      message: "All foods retrieved successfully",
      data: foods,
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
}

export async function sortFoods(req, res) {
  try {
    const { sortBy } = req.query;
    if (!sortBy) {
      return res.status(400).json({
        success: false,
        message: "SortBy query parameter is required",
      });
    }

    let foods = await findAll();

    switch (sortBy) {
      case "Calories":
        foods.sort((a, b) => a.calories - b.calories);
        break;
      case "Name":
        foods.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Category":
        foods.sort((a, b) => a.category.localeCompare(b.category));
        break;
      default:
        return res.status(400).json({
          success: false,
          message:
            "Invalid sortBy value. Use 'Calories', 'Name', or 'Category'",
        });
    }

    return res.status(200).json({
      success: true,
      message: "Foods sorted successfully",
      data: foods,
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
}
