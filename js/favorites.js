// const shoppingList = {};

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