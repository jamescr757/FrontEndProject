// const shoppingList = {};
// let ingredientList = [];
// let ingredientBullets = [];

// const createIngredientBullets = meal => {
//     const bullets = [];
//     let count = 1;
//     while (meal[`strMeasure${count}`].trim()) {
//         bullets.push(meal[`strIngredient${count}`].trim() + " - " + meal[`strMeasure${count}`]);
//         count++;
//     }
//     return bullets;
// }

// const createIngredientList = meal => {
//     const list = [];
//     let count = 1;
//     while (meal[`strMeasure${count}`].trim()) {
//         list.push(meal[`strMeasure${count}`].trim() + " " + meal[`strIngredient${count}`]);
//         count++;
//     }
//     return list;
// }

// const createShoppingListObj = item => {
//     return {
//         product: item.ingredientParsed.product,
//         quantity: item.ingredientParsed.quantity,
//         unit: item.ingredientParsed.unit,
//         rawString: item.ingredientRaw
//     }
// }


// ============== REMOVING DUPLICATES BEFORE RENDERING =====================

// let selections = JSON.parse(localStorage.getItem("selections"));
// const selectionsHash = {};
// for (const meal of selections) {
//     if (!(meal.strMeal in selectionsHash)) selectionsHash[meal.strMeal] = meal;
// }
// selections = [];
// for (const meal in selectionsHash) {
//     selections.push(selectionsHash[meal]);
// }
// localStorage.setItem("selections", JSON.stringify(selections));


// fetch('https://zestful.p.rapidapi.com/parseIngredients', {
//     headers: {
//     'content-type': 'application/json',
//     'x-rapidapi-host': 'zestful.p.rapidapi.com',
//     'x-rapidapi-key': rapidAPIkey
//   },
//   method: "POST",
//   body: JSON.stringify({ingredients})  
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })

// fetch('https://zestful.p.rapidapi.com/parseIngredients', {
//     headers: {
//         'content-type': 'application/json',
//         'x-rapidapi-host': 'zestful.p.rapidapi.com',
//         'x-rapidapi-key': rapidAPIkey
//     },
//     method: "POST",
//     body: JSON.stringify({ingredients: ingredientList})  
// })
// .then(response => response.json())
// .then(data => {
//     console.log(data);
//     for (const item of data.results) {
//         if (!(item.ingredientParsed.product in shoppingList)) {
//             shoppingList[item.ingredientParsed.product] = [createShoppingListObj(item)];
//         } else {
//             let sameUnit = false;
//             for (const obj of shoppingList[item.ingredientParsed.product]) {
//                 if (obj.unit === item.ingredientParsed.unit) {
//                     sameUnit = true;
//                     obj.quantity += item.ingredientParsed.quantity;
//                 }
//             }
//             if (!sameUnit) {
//                 shoppingList[item.ingredientParsed.product].push(createShoppingListObj(item));
//             }
//         }
//     }
//     console.log(shoppingList);
// })

// data.results is an array of parse ingredients
// each object element has key ingredientParsed
// traverse data.results and pull off following keys
// ingredientParsed.product, ingredientParsed.quantity, ingredientParsed.unit