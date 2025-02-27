// routes/foodRoutes.js
const express = require("express");
const router = express.Router();
const FoodController = require("../controller/FoodController.js");

router.get("/search", FoodController.searchFoods);
router.post("/add", FoodController.addFood);
router.get("/all", FoodController.getAllFoods);
router.get("/sort", FoodController.sortFoods);

module.exports = router;
