const createIngredientList = meal => {
    const list = [];
    let count = 1;
    while (meal[`strMeasure${count}`] && meal[`strMeasure${count}`].trim()) {
        list.push(meal[`strMeasure${count}`].trim() + " " + meal[`strIngredient${count}`]);
        count++;
    }
    return list;
}

const createIngredientBullets = meal => {
    const bullets = [];
    let count = 1;
    while (meal[`strMeasure${count}`] && meal[`strMeasure${count}`].trim()) {
        bullets.push(meal[`strIngredient${count}`].trim() + " - " + meal[`strMeasure${count}`]);
        count++;
    }
    return bullets;
}

const createShoppingListObj = item => {
    return {
        product: item.ingredientParsed.product,
        quantity: item.ingredientParsed.quantity,
        unit: item.ingredientParsed.unit,
        rawString: item.ingredientRaw
    }
}

const removeSelectionDuplicates = () => {
    let selections = JSON.parse(localStorage.getItem("selections"));
    const selectionsHash = {};
    for (const meal of selections) {
        if (!(meal.strMeal in selectionsHash)) selectionsHash[meal.strMeal] = meal;
    }
    selections = [];
    for (const meal in selectionsHash) {
        selections.push(selectionsHash[meal]);
    }
    localStorage.setItem("selections", JSON.stringify(selections));
}

const renderQuantity = value => !value ? "" : value;

const renderUnit = (quantity, unit) => {
    if (quantity && unit) return ` ${unit}`;
    else if (!quantity && unit) return unit;
    else return "";
}

const shoppingListHTML = shoppingList => {
    let html = ["<ul>"];
    for (const item in shoppingList) {
        if (shoppingList[item].length > 1) {
            html.push(`<li>${shoppingList[item].product}<ul>`);
            for (const unitType of shoppingList[item]) {
                const htmlFragment = `<li>${renderQuantity(unitType.quantity)}${renderUnit(unitType.quantity, unitType.unit)}</li>`;
                if (htmlFragment === "<li></li>") continue;
                html.push(htmlFragment);
            }
            html.push("</ul></li>");
        } else {
            if (shoppingList[item][0].quantity || shoppingList[item][0].product) {
                html.push(`<li>${shoppingList[item][0].product} - ${renderQuantity(shoppingList[item][0].quantity)}${renderUnit(shoppingList[item][0].quantity, shoppingList[item][0].unit)}<li>`);
            } else html.push(`<li>${shoppingList[item][0].product}</li>`);
        }
    }
    html.push("</ul>");
    return html.join("");
}

const buildShoppingList = data => {
    const shoppingList = {};
    for (const item of data.results) {
        if (!(item.ingredientParsed.product in shoppingList)) {
            shoppingList[item.ingredientParsed.product] = [createShoppingListObj(item)];
        } else {
            let sameUnit = false;
            for (const obj of shoppingList[item.ingredientParsed.product]) {
                if (obj.unit === item.ingredientParsed.unit) {
                    sameUnit = true;
                    obj.quantity += item.ingredientParsed.quantity;
                }
            }
            if (!sameUnit) shoppingList[item.ingredientParsed.product].push(createShoppingListObj(item));
        }
    }
    return shoppingList;
}

const fetchParsedIngredients = async ingredientList => {
    let response = await fetch('https://zestful.p.rapidapi.com/parseIngredients', {
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-host': 'zestful.p.rapidapi.com',
            'x-rapidapi-key': rapidAPIkey
        },
        method: "POST",
        body: JSON.stringify({ingredients: ingredientList})  
    });
    return await response.json()
}

const renderShoppingList = async () => {
    const meals = localStorage.getItem("selections");
    let ingredientList = [];
    for (const meal of meals) {
        ingredientList = [...ingredientList, ...createIngredientList(meal)]
    }
    const parsedIngredients = await fetchParsedIngredients(ingredientList);
    const shoppingList = buildShoppingList(parsedIngredients);
    const listHTML = shoppingListHTML(shoppingList);
    // shoppingListContainer.innerHTML = listHTML;
}

const retrieveMealFromStorage = event => {
    return JSON.parse(sessionStorage.getItem(event.target.attributes.value.value));
}

const ingredientListHTML = (meal) => {
    let html = ["<ul>"];
    const bulletList = createIngredientBullets(meal);
    for (const bullet of bulletList) {
        html.push(`<li>${bullet}</li>`);
    }
    html.push("</ul>");
    return html.join("");
}

const removeCards = () => {
    while (document.querySelector(".cardContainer")) {
        document.body.removeChild(document.querySelector(".cardContainer"))
    }
}

const displayMeal = event => {
    if (event.target.attributes && event.target.attributes.value) {
        removeCards();
        const mealObj = retrieveMealFromStorage(event);
        shoppingListTitle.innerText = mealObj.strMeal;
        mealImage.setAttribute("src", mealObj.strMealThumb);
        shoppingList.innerHTML = ingredientListHTML(mealObj);
        mealInstructions.innerHTML += `<p>${mealObj.strInstructions}</p>`;
    }
}

const removeMealFromSelections = itemName => {
    let selections = JSON.parse(localStorage.getItem("selections"));
    selections = selections.filter(mealObj => mealObj.strMeal !== itemName);
    localStorage.setItem("selections", JSON.stringify(selections));
}

const selectionsDelete = event => {
    const classString = event.target.className.split(" ");
    if (classString[2] === "fa-circle-not-selected") {
        const itemName = classString.slice(3).join(" ");
        removeMealFromSelections(itemName);
        renderMealCards();
        renderShoppingList();
    }
}

const renderCardContainer = (cardContainer, htmlString) => {
    cardContainer.innerHTML = htmlString;
    cardContainer.addEventListener("click", selectionsDelete);
    cardContainer.addEventListener("click", displayMeal);
    document.body.appendChild(cardContainer);
}

const renderMealCards = () => {
    const meals = JSON.parse(localStorage.getItem("selections"));
    let html = "";
    let cardContainer;
    for (let idx = 0; idx < meals.length; idx++) {
        if (idx % 2 === 0) {
            cardContainer = document.createElement("div");
            cardContainer.className = "cardContainer";
            html = "";
        }
        html += `
        <div class="card">
            <img src=${meals[idx].strMealThumb} class="card-img-top" alt=${meals[idx].strMeal}>
            <i class="fa-solid fa-circle-plus fa-circle-not-selected fa-2xl ${meals[idx].strMeal}"></i>
            <i class="fa-solid fa-circle fa-2xl"></i>
            <h5 class="card-title">${meals[idx].strMeal}</h5>
            <button class="btn btn-warning" value="${meals[idx].strMeal}">Time to Cook</button>
        </div>`;
        if ((idx + 1) % 2 === 0) renderCardContainer(cardContainer, html);
    }
    if (html) renderCardContainer(cardContainer, html);
}

const onPageVisit = async () => {
    if (localStorage.getItem("selections")) {
        removeSelectionDuplicates();
        renderMealCards();
        await renderShoppingList();
    } else {
        // cardContainer.innerHTML = "<h5>Please visit <a href="../index.html">home</a> page to select a few meals</h5>"
        // shoppingList.innerHTML = "<p>No ingredients to display</p>"
    }
}







// data.results is an array of parse ingredients
// each object element has key ingredientParsed
// traverse data.results and pull off following keys
// ingredientParsed.product, ingredientParsed.quantity, ingredientParsed.unit