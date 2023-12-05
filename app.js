let searchBar = document.getElementById("search-bar");
let form = document.querySelector("form");
let randomMealContainer = document.getElementById("random-meal-container");
let searchBtn = document.getElementById("search-button");
let resultItems = document.getElementById("meals");
let modalContent = document.querySelector(".modal-content");
let randomMealHeading = document.getElementById("random-meal-heading");
let ingredientsData = document.getElementById("ingredients");
let separator = document.getElementById("separator");
let procedureData = document.getElementById("procedure");

let randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

async function getRandomMeal() {
  try {
    const res = await fetch(randomMealUrl);
    const data = await res.json();
    const ingredients = data.meals[0].strMealThumb;
    const mealName = data.meals[0].strMeal;
    randomMealContainer.innerHTML = `
        <img id="random-meal-img" src="${ingredients}" alt="">
        <p id="meal-name">${mealName}</p>`;

    randomMealHeading.textContent = `${mealName}`;
    let string = "";
    for (let i = 1; i <= 20; i++) {
      if (data.meals[0]["strIngredient" + i]) {
        string += `<li>${data.meals[0]["strIngredient" + i]}</li>`;
      } else {
        break;
      }
    }
    ingredientsData.innerHTML = string;
    procedure.innerHTML = `<br><h3>Procedure</h3><br><p>${data.meals[0].strInstructions}</p>`;
  } catch (err) {

  }
}

getRandomMeal();

async function getSearchedMeal(searchBar) {
  try {
    let inputValue = searchBar.value.trim();
    if (!inputValue) {
      resultItems.style.display = "block";
      resultItems.innerHTML = `<h2>Opps! Search value is empty 😒</h2>`;
      return;
    }

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
    );
    const responseData = await response.json();
    const meals = responseData.meals;
    resultItems.innerHTML = "";

    if (!meals || meals.length === 0) {
      resultItems.style.display = "block";
      resultItems.innerHTML = `<h2>Sorry, We don't have the recipe of ${inputValue} 😓</h2>`;
    }

    meals.forEach((item) => {
      let div = document.createElement("div");
      div.setAttribute("class", "container");
      resultItems.style.display = "grid";
      div.setAttribute("id", item.idMeal);
      let image = document.createElement("img");
      image.setAttribute("class", "image");
      image.setAttribute("id", item.idMeal + "i");
      image.src = item.strMealThumb;

      let p = document.createElement("p");
      p.setAttribute("class", "meal-name");
      p.setAttribute("id", item.idMeal + "p");
      p.textContent = item.strMeal;
      div.appendChild(image);
      div.appendChild(p);
      resultItems.appendChild(div);
    });

    let allContainerP = document.getElementsByClassName("meal-name");
    let allContainerimg = document.getElementsByClassName("image");
    for (i of allContainerP) {
      i.addEventListener("click", (e) => {
        let idp = e.target.id;
        let id = idp.slice(0, 5);
        displayPopUp(id);
      });
    }
    for (i of allContainerimg) {
      i.addEventListener("click", (e) => {
        let idimg = e.target.id;
        let id = idimg.slice(0, 5);
        displayPopUp(id);
      });
    }
  } catch (err) {
  }
}

async function displayPopUp(id) {
  let idUrl = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await idUrl.json();
  const ingredients = data.meals[0].strMealThumb;
  const mealName = data.meals[0].strMeal;
  randomMealContainer.innerHTML = `
        <img id="random-meal-img" src="${ingredients}" alt="">
        <p id="meal-name">${mealName}</p>`;

  randomMealHeading.textContent = `${mealName}`;
  let string = "";
  for (let i = 1; i <= 20; i++) {
    if (data.meals[0]["strIngredient" + i]) {
      string += `<li>${data.meals[0]["strIngredient" + i]}</li>`;
    } else {
      break;
    }
  }
  ingredientsData.innerHTML = string;
  procedure.innerHTML = `<br><h3>Procedure</h3><br><p>${data.meals[0].strInstructions}</p>`;

  document.getElementById("myModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getSearchedMeal(searchBar);
  resultItems.scrollIntoView({ behavior: "smooth" });
});

searchBtn.onclick = () => {
  getSearchedMeal(searchBar);
  resultItems.scrollIntoView({ behavior: "smooth" });
};

document
  .getElementById("random-meal-container")
  .addEventListener("click", function () {
    // Show the modal
    document.getElementById("myModal").style.display = "flex";
    document.body.style.overflow = "hidden";
  });

// Close the modal when the close button or outside the modal is clicked
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
  document.body.style.overflow = "auto";
});

// Add this part to close the modal when pressing the Escape key
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    document.getElementById("myModal").style.display === "block"
  ) {
    document.getElementById("myModal").style.display = "none";
  }
});
