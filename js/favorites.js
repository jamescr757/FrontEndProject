// const ingredients = ['2 tbs Olive Oil', '1 medium finely diced Onion', '250g Chickpeas', '1.5L Vegetable Stock', '1 tsp Cumin', '5 cloves Garlic', '1/2 tsp Salt', '1 tsp Harissa Spice', 'Pinch Pepper', '1/2 Lime']

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

// data.results is an array of parse ingredients
// each object element has key ingredientParsed
// traverse data.results and pull off following keys
// ingredientParsed.product, ingredientParsed.quantity, ingredientParsed.unit