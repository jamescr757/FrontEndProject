// const ingredients = [
//     '2 1/2 tablespoons finely chopped parsley',
//     '3 tablespoons extra-virgin olive oil, or more to taste',
//     '1 1/2 tbsp cinnamon'
// ]

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