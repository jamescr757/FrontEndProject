const meals = ["chicken", "soup", "beef", "pork"];
const userSearch = document.getElementById("userSearch");
const searchBtn = document.getElementById("searchButton");
const searchText = document.querySelector(".search-text");
const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");


const pickRandomMeal = () => {
    const randomIdx = Math.floor(Math.random() * meals.length);
    return meals[randomIdx];
}

const updateSelectionsInStorage = (selections, item) => {
    selections.push(item);
    localStorage.setItem("selections", JSON.stringify(selections));
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

const addMealToSelections = itemName => {
    const itemObj = JSON.parse(sessionStorage.getItem(itemName));
    if (localStorage.getItem("selections")) {
        updateSelectionsInStorage(JSON.parse(localStorage.getItem("selections")), itemObj);
    } else {
        updateSelectionsInStorage([], itemObj);
    }
}

const removeMealFromSelections = itemName => {
    let selections = JSON.parse(localStorage.getItem("selections"));
    selections = selections.filter(mealObj => mealObj.strMeal !== itemName);
    localStorage.setItem("selections", JSON.stringify(selections));
}

const changeIconAndUpdateSelections = event => {
    const classString = event.target.className.split(" ");
    if (classString[2] === "fa-circle-not-selected") {
        const itemName = classString.slice(4).join(" ");
        event.target.className = `fa-solid fa-circle-plus fa-2xl ${itemName}`;
        addMealToSelections(itemName);
    } else if (classString[2] === "fa-2xl") {
        const itemName = classString.slice(3).join(" ");
        event.target.className = `fa-solid fa-circle-plus fa-circle-not-selected fa-2xl ${itemName}`;
        removeMealFromSelections(itemName);
    }
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

const displayRecipeInfo = event => {
    if (event.target.attributes && event.target.attributes.value) {
        const mealObj = retrieveMealFromStorage(event);
        modalTitle.innerText = mealObj.strMeal;
        modalBody.innerHTML = ingredientListHTML(mealObj);
        modalBody.innerHTML += `<p>${mealObj.strInstructions}</p>`;
    }
}

const removeCardsAndFooter = () => {
    while (document.querySelector(".cardContainer")) {
        document.body.removeChild(document.querySelector(".cardContainer"))
    }
    document.body.removeChild(document.querySelector("footer"));
}

const renderCardContainer = (cardContainer, htmlString) => {
    cardContainer.innerHTML = htmlString;
    cardContainer.addEventListener("click", changeIconAndUpdateSelections);
    cardContainer.addEventListener("click", displayRecipeInfo);
    document.body.appendChild(cardContainer);
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

const fetchMeals = async mealToSearch => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealToSearch}`);
    return await response.json();
}

const renderMealCards = data => {
    let html = "";
    let cardContainer;
    for (let idx = 0; idx < data.meals.length; idx++) {
        if (idx % 3 === 0) {
            cardContainer = document.createElement("div");
            cardContainer.className = "cardContainer";
            html = "";
        }
        html += `
        <div class="card">
            <img src=${data.meals[idx].strMealThumb} class="card-img-top" alt=${data.meals[idx].strMeal}>
            <i class="fa-solid fa-circle-plus fa-circle-not-selected fa-2xl ${data.meals[idx].strMeal}"></i>
            <i class="fa-solid fa-circle fa-2xl"></i>
            <h5 class="card-title">${data.meals[idx].strMeal}</h5>
            <button class="btn btn-warning" value="${data.meals[idx].strMeal}" data-toggle="modal" data-target="#myModal">View Recipe</button>
        </div>`;
        if ((idx + 1) % 3 === 0) renderCardContainer(cardContainer, html);
    }
    if (html) renderCardContainer(cardContainer, html);

    for (const meal of data.meals) {
        sessionStorage.setItem(meal.strMeal, JSON.stringify(meal))
    }
}

const searchForMeals = async event => {
    event.preventDefault();
    const userInput = userSearch.value.trim();
    if (userInput) {
        const data = await fetchMeals(userInput);
        console.log(data);
        removeCardsAndFooter();
        if (!data.meals) {
            searchText.innerText = `Search produced no results. Please try something different.`;
            renderFooter(true);
        } else {
            searchText.innerText = "Search or scroll for inspiration to add to your recipe box!";
            renderMealCards(data);
            renderFooter();
        }
    }
}


searchBtn.addEventListener("click", searchForMeals);


const onPageVisit = async () => {
    const mealToSearch = pickRandomMeal();
    const data = await fetchMeals(mealToSearch);
    renderMealCards(data);
    renderFooter();
}

onPageVisit();

