const selectionsContainer = document.querySelector(".yourSelections");
const groceryListTag = document.querySelector(".groceryListItems");
const listCardTitle = document.querySelector(".card-title");
const selectionsPage = document.querySelector(".yourSelectionsPage");
const footerTag = document.querySelector("footer");

const createIngredientList = meal => {
    const list = [];
    let count = 1;
    while (meal[`strMeasure${count}`] && meal[`strMeasure${count}`].trim() && list.length < 100) {
        list.push(meal[`strMeasure${count}`].trim() + " " + meal[`strIngredient${count}`]);
        count++;
    }
    return list;
}

const capitalize = string => string[0].toUpperCase() + string.slice(1);

const createIngredientBullets = meal => {
    const bullets = [];
    let count = 1;
    while (meal[`strMeasure${count}`] && meal[`strMeasure${count}`].trim()) {
        bullets.push(capitalize(meal[`strIngredient${count}`].trim()) + " - " + meal[`strMeasure${count}`]);
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

const renderQuantity = value => !value ? "" : Math.round(value * 100) / 100;

const renderUnit = (quantity, unit) => {
    if (quantity && unit) return ` ${unit}`;
    else if (!quantity && unit) return unit;
    else return "";
}

const shoppingListHTML = shoppingList => {
    let html = ["<ul>"];
    for (const item in shoppingList) {
        if (shoppingList[item].length > 1) {
            html.push(`<li>${capitalize(shoppingList[item][0].product)}<ul>`);
            for (const unitType of shoppingList[item]) {
                const htmlFragment = `<li>${renderQuantity(unitType.quantity)}${renderUnit(unitType.quantity, unitType.unit)}</li>`;
                if (htmlFragment === "<li></li>") continue;
                html.push(htmlFragment);
            }
            html.push("</ul></li>");
        } else {
            if (shoppingList[item][0].quantity || shoppingList[item][0].unit) {
                html.push(`<li>${capitalize(shoppingList[item][0].product)} - ${renderQuantity(shoppingList[item][0].quantity)}${renderUnit(shoppingList[item][0].quantity, shoppingList[item][0].unit)}</li>`);
            } else html.push(`<li>${capitalize(shoppingList[item][0].product)}</li>`);
        }
    }
    html.push("</ul>");
    return html.join("");
}

const buildShoppingList = data => {
    const shoppingList = {};
    for (const item of data.results) {
        const itemName = item.ingredientParsed.product.toLowerCase();
        if (!(itemName in shoppingList)) {
            shoppingList[itemName] = [createShoppingListObj(item)];
        } else {
            let sameUnit = false;
            for (const obj of shoppingList[itemName]) {
                if (obj.unit === item.ingredientParsed.unit) {
                    sameUnit = true;
                    obj.quantity += item.ingredientParsed.quantity;
                }
            }
            if (!sameUnit && (item.ingredientParsed.unit || item.ingredientParsed.quantity)) {
                shoppingList[itemName].push(createShoppingListObj(item));
            }
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
    const meals = JSON.parse(localStorage.getItem("selections"));
    let ingredientList = [];
    for (const meal of meals) {
        ingredientList = [...ingredientList, ...createIngredientList(meal)]
    }
    const parsedIngredients = await fetchParsedIngredients(ingredientList);
    const shoppingList = buildShoppingList(parsedIngredients);
    const listHTML = shoppingListHTML(shoppingList);
    groceryListTag.innerHTML = listHTML;
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
    while (document.querySelector(".yourSelectionsCardContainer")) {
        selectionsContainer.removeChild(document.querySelector(".yourSelectionsCardContainer"))
    }
}

const renderFooter = (addMargin=false) => {
    const footerTag = document.createElement("footer");
    footerTag.innerHTML = `
    <ul class="api">
        APIs used:
        <li><a class="apiLink" href="https://www.themealdb.com/">TheMealDB</a></li>
        <li><a class="apiLink" href="https://zestfuldata.com/">Zestful</a></li>
    </ul>
    <span class="copyright">© 2022 Recipe Box</span>
    <ul class="devTeam">
        <li>  <i class="bi bi-linkedin"> </i>  <i class="bi bi-github"></i> James Riddle</li>
        <li>  <i class="bi bi-linkedin"> </i>  <i class="bi bi-github"></i> Chloe Wieser</li>
        <li>  <i class="bi bi-linkedin"></i>  <i class="bi bi-github"></i> Veronica Taucci</li>
    </ul>`;
    if (addMargin) footerTag.className = "mt-5"
    document.body.appendChild(footerTag);
}

const clearMainContent = () => {
    document.body.removeChild(selectionsPage);
    document.body.removeChild(footerTag);
}

const renderMealTitle = meal => {
    const titleTag = document.createElement("div");
    titleTag.className = "mealName";
    titleTag.innerText = meal.strMeal;
    document.body.appendChild(titleTag);
}

const renderMealImageAndMethod = meal => {
    const container = document.createElement("div");
    container.className = "mealPrep";
    container.innerHTML = `
    <img src="${meal.strMealThumb}" class="prepImage2 card-img-top mb-4" alt="${meal.strMeal}">
    <div class="imgList">
        <img src="${meal.strMealThumb}" class="prepImage card-img-top" alt="${meal.strMeal}"> 
        <p class="method">Method</p>
        <p class="mealMethod">${meal.strInstructions}</p>
    </div>`;
    document.body.appendChild(container);
}

const renderIngredientList = meal => {
    const container = document.querySelector(".mealPrep");
    const listContainer = document.createElement("div");
    listContainer.className = "ingredients card shadow rounded";
    let listHTML = "<h5 class='card-title text-center mt-1 pt-2'>Ingredients</h5>";
    listHTML += ingredientListHTML(meal);
    listContainer.innerHTML = listHTML;
    container.appendChild(listContainer);
}

const displayMeal = event => {
    if (event.target.attributes && event.target.attributes.value) {
        clearMainContent();
        const mealObj = retrieveMealFromStorage(event);
        renderMealTitle(mealObj);
        renderMealImageAndMethod(mealObj);
        renderIngredientList(mealObj);
        renderFooter();
    }
}

const removeMealFromSelections = itemName => {
    let selections = JSON.parse(localStorage.getItem("selections"));
    selections = selections.filter(mealObj => mealObj.strMeal !== itemName);
    localStorage.setItem("selections", JSON.stringify(selections));
}

const noSelectionsMessage = () => {
    h5tag = document.createElement("h5");
    h5tag.innerHTML = `<h5>Please visit our <a href="../index.html">home</a> page to select a few meals</h5>`;
    selectionsContainer.appendChild(h5tag);
    groceryListTag.innerHTML = "<p>No ingredients to display</p>";
}

const renderMealCards = (removeCardsFromDOM=false) => {
    if (removeCardsFromDOM) removeCards(); 
    const meals = JSON.parse(localStorage.getItem("selections"));
    if (!meals.length) noSelectionsMessage();
    let html = "";
    let cardContainer;
    for (let idx = 0; idx < meals.length; idx++) {
        if (idx % 2 === 0) {
            cardContainer = document.createElement("div");
            cardContainer.className = "yourSelectionsCardContainer";
            html = "";
        }
        html += `
        <div class="card">
            <img src=${meals[idx].strMealThumb} class="card-img-top" alt=${meals[idx].strMeal}>
            <i class="fa-solid fa-trash-can fa-md ${meals[idx].strMeal}"></i>
            <i class="circle-yellow fa-solid fa-circle fa-xl"></i>
            <h5 class="card-title">${meals[idx].strMeal}</h5>
            <button class="btn btn-warning" value="${meals[idx].strMeal}">Time to Cook</button>
        </div>`;
        if ((idx + 1) % 2 === 0) renderCardContainer(cardContainer, html);
    }
    if (html) renderCardContainer(cardContainer, html);

    for (const meal of meals) {
        sessionStorage.setItem(meal.strMeal, JSON.stringify(meal))
    }
}

const selectionsDelete = event => {
    const classString = event.target.className.split(" ");
    if (classString[1] === "fa-trash-can") {
        const itemName = classString.slice(3).join(" ");
        removeMealFromSelections(itemName);
        renderMealCards(true);
        renderShoppingList();
    }
}

const renderCardContainer = (cardContainer, htmlString) => {
    cardContainer.innerHTML = htmlString;
    cardContainer.addEventListener("click", selectionsDelete);
    cardContainer.addEventListener("click", displayMeal);
    selectionsContainer.appendChild(cardContainer);
}

const onPageVisit = async () => {
    if (localStorage.getItem("selections")) {
        removeSelectionDuplicates();
        renderMealCards();
        renderShoppingList();   
    } else {
        noSelectionsMessage();
    }
}

onPageVisit();