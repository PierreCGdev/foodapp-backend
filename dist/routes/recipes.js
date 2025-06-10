"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get('/categories', function (req, res) {
    fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
        .then(response => response.json())
        .then(data => res.json({ result: true, categories: data.categories }))
        .catch(error => {
        res.status(500).json({ result: false, error });
    });
});
router.get('/:categoryName', function (req, res) {
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${req.params.categoryName}`)
        .then(response => response.json())
        .then(data => res.json({ result: true, recipes: data.meals }))
        .catch(error => {
        res.status(500).json({ result: false, error });
    });
});
function extractIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const name = meal[`strIngredient${i}`];
        const amount = meal[`strMeasure${i}`];
        if (name && name.trim() !== "") {
            ingredients.push({
                name: name.trim(),
                amount: amount?.trim() || "",
            });
        }
    }
    return ingredients;
}
router.get('/recipe/:id', function (req, res) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${req.params.id}`)
        .then(response => response.json())
        .then(data => {
        const meal = data.meals[0];
        if (!meal) {
            return res.status(404).json({ result: false, error: 'Recipe not found' });
        }
        const ingredients = extractIngredients(meal);
        res.json({ result: true, recipe: {
                id: meal.idMeal,
                name: meal.strMeal,
                category: meal.strCategory,
                area: meal.strArea,
                instructions: meal.strInstructions,
                image: meal.strMealThumb,
                tags: meal.strTags ? meal.strTags.split(',') : [],
                youtube: meal.strYoutube,
                ingredients: ingredients,
            } });
    })
        .catch(error => {
        res.status(500).json({ result: false, error });
    });
});
module.exports = router;
