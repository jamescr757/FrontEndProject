// const areaSearch = "Canadian";
// const categorySearch = "Vegetarian";
const mealSearch = "soup";
let ingredientList = [];
let ingredientBullets = [];

const createIngredientStrings = meal => {
    const list = [];
    const bullets = [];
    let count = 1;
    while (meal[`strMeasure${count}`].trim()) {
        list.push(meal[`strMeasure${count}`].trim() + " " + meal[`strIngredient${count}`]);
        bullets.push(meal[`strIngredient${count}`].trim() + " - " + meal[`strMeasure${count}`]);
        count++;
    }
    return [list, bullets];
}

const createShoppingListObj = item => {
    return {
        product: item.ingredientParsed.product,
        quantity: item.ingredientParsed.quantity,
        unit: item.ingredientParsed.unit,
        rawString: item.ingredientRaw
    }
}

fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealSearch}`)
.then(response => response.json())
.then(data => {
    console.log(data);
    
    for (let idx = 0; idx < 6; idx++) {
        ingredientList = [...ingredientList, ...createIngredientStrings(data.meals[idx])[0]]; 
        ingredientBullets = [...ingredientBullets, ...createIngredientStrings(data.meals[idx])[1]];
    }
    // console.log(ingredientList);
    
    // for (const meal of data.meals) {
    //     sessionStorage.setItem(meal.strMeal, JSON.stringify(meal))
    // }
})
    

// data.meals is an array of recipes 
// traverse data.meals and retrieve following keys 
// strIngredient1 -> strIngredient20 - loop until null or empty string
// strMeasure1 -> strMeasure20 - loop until falsey
// strMeasure1 goes with strIngredient1
// strMeal is name of meal 
// strMealThumb is url of meal image 
// strInstructions is cooking method description


// =================== USING STORAGE WITH CARDS =================================

// when rendering cards, need to add a value attribute to modal button that is equal to meal name aka meal.strMeal
// once clicked, use that value to retrive the data object from storage 
// const card = document.querySelector(".card");
// card.addEventListener("click", event => {
//     const itemObj = JSON.parse(sessionStorage.getItem(event.target.attributes.value.value));
// })


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

