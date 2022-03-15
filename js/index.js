// const areaSearch = "Canadian";
// const categorySearch = "Vegetarian";
const mealSearch = "soup";
const ingredientList = [];
const ingredientBullets = [];

fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealSearch}`)
.then(response => response.json())
.then(data => {
    const selection = data.meals[0];

    let count = 1;
    while (selection[`strMeasure${count}`].trim()) {
        ingredientList.push(selection[`strMeasure${count}`].trim() + " " + selection[`strIngredient${count}`]);
        ingredientBullets.push(selection[`strIngredient${count}`].trim() + " - " + selection[`strMeasure${count}`]);
        count++;
    }
    console.log(ingredientList);
    console.log(ingredientBullets);
})


// data.meals is an array of recipes 
// traverse data.meals and retrieve following keys 
// strIngredient1 -> strIngredient20 - loop until null or empty string
// strMeasure1 -> strMeasure20 - loop until falsey
// strMeasure1 goes with strIngredient1
// strMeal is name of meal 
// strMealThumb is url of meal image 
// strInstructions is cooking method description



// ======================= CATEGORY SEARCH ======================================

// fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorySearch}`)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })

// data.meals is an array of meals 
// each object element only has 3 keys - idMeal, strMeal, strMealThumb
// need to use meal search api in combination to retrieve recipe


// ======================= AREA SEARCH ======================================

// fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaSearch}`)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })

// same response type/structure as category search

