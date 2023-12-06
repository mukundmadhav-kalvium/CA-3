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

// API Url to get a random meal
let randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php";

// Async function to generate random meal
async function getRandomMeal() {
  try {
    // Fetching data from randomMealUrl and storing data in the form of array in constant data
    const res = await fetch(randomMealUrl);
    const data = await res.json();
    const ingredients = data.meals[0].strMealThumb;
    const mealName = data.meals[0].strMeal;

    //Appending meal name, meal ingredients, and procedure to the modal of random meal container
    
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

// Calling Random Meal function

getRandomMeal();

// Async function to get the desired searched meal

async function getSearchedMeal(searchBar) {
  try {
    // Triming input value
    let inputValue = searchBar.value.trim();
    // Checking if input value is empty
    if (!inputValue) {
      resultItems.style.display = "block";
      resultItems.innerHTML = `<h2>Opps! Search value is empty 😒</h2>`;
      return;
    }

    // Fetching data from API of desired meal and storing in array in constant responseData
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`
    );
    const responseData = await response.json();
    const meals = responseData.meals;
    resultItems.innerHTML = "";

    //Checking if meal is present in the API or not
    if (!meals || meals.length === 0) {
      resultItems.style.display = "block";
      resultItems.innerHTML = `<h2>Sorry, We don't have the recipe of ${inputValue} 😓</h2>`;
    }

    // Adding meals in the searched meals container and giving ids to the elements
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

    // Checking which meal is clicked and then displaying modal of that meal
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

// Async function to display modal of searched meal
async function displayPopUp(id) {
  let idUrl = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  let data = await idUrl.json();
  const ingredients = data.meals[0].strMealThumb;
  const mealName = data.meals[0].strMeal;
  //Appending meal name, meal ingredients, and procedure to the modal of random meal container
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
// Displaying modal using flex and disabling background scroll
  document.getElementById("myModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Adding eventlistener to form and calling getSearchedMeal function with an arguement of input value
form.addEventListener("submit", (e) => {
  e.preventDefault();
  getSearchedMeal(searchBar);
  // Adding a smooth transition to the form after user pressing "enter"
  resultItems.scrollIntoView({ behavior: "smooth" });
});

// Calling getSearchedMeal function when the user click on search button
searchBtn.onclick = () => {
  getSearchedMeal(searchBar);
  // Adding a smooth transition between the search bar and searched meal container when user click on search button
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

//When user press the Escape key modal will close
document.addEventListener("keydown", function (event) {
  if (
    event.key === "Escape" &&
    document.getElementById("myModal").style.display === "flex"
  ) {
    document.getElementById("myModal").style.display = "none";
  }
});