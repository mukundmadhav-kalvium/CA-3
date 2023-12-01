let searchBar = document.getElementById("search-bar")
let form = document.querySelector("form")
let randomMealContainer = document.getElementById("random-meal-container")
let searchBtn = document.getElementById("search-button")
let resultItems = document.getElementById("meals")
let modalContent = document.querySelector(".modal-content")
let randomMealHeading = document.getElementById("random-meal-heading")
let ingredients_data = document.getElementById("ingredients")
let separator = document.getElementById("separator")
let procedure = document.getElementById("procedure")

let randomMealUrl = "https://www.themealdb.com/api/json/v1/1/random.php"

async function getRandomMeal(){
    try{
        const res = await fetch(randomMealUrl)
        const data = await res.json()
        const ingredients = data.meals[0].strMealThumb
        const mealName = data.meals[0].strMeal
        console.log(data);
        randomMealContainer.innerHTML = `
        <img id="random-meal-img" src="${ingredients}" alt="">
        <p id="meal-name">${mealName}</p>`

        randomMealHeading.textContent=`${mealName}`
        for (let i = 1; i <= 20; i++) {
            if (data.meals[0]['strIngredient' + i] !== "") {
                ingredients_data.innerHTML += `<li>${data.meals[0]['strIngredient' + i]}</li>`
            }
        }
        
        procedure.innerHTML += `<p>${data.meals[0].strInstructions}</p>`

    }
    catch(err){
        console.log("error in random meal function: ", err);
    }
}

getRandomMeal();

async function getSearchedMeal(searchBar){
    try{
        let inputValue = searchBar.value.trim()
        if (!inputValue) {
            console.log("Input value is empty");
            resultItems.innerHTML="";
            return;
        }
        
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`)
        const responseData = await response.json()
        console.log(responseData);
        const meals = responseData.meals
        resultItems.innerHTML="";
        
        if (!meals || meals.length === 0) {
            console.log("No meals found");
            let div = document.createElement("div")
            let p = document.createElement("p")
            p = "No meals found!!!"
            div.appendChild(p)
            return;
        }
        
        meals.forEach((item)=>{
            let div = document.createElement("div");
            div.setAttribute("class","container");
            let image = document.createElement("img");
            image.setAttribute("class", "image");
            image.src = item.strMealThumb;
            
            let p = document.createElement("p");
            p.setAttribute("class","meal-name");
            p.textContent = item.strMeal;
            div.appendChild(image);
            div.appendChild(p);
            resultItems.appendChild(div)
            
        })
    }
    catch(err){
        console.log("error in searched meal function: ",err);
    }
}

form.addEventListener("submit", (e)=>{e.preventDefault() 
    getSearchedMeal(searchBar)});
    
    searchBtn.onclick=()=>{
        getSearchedMeal(searchBar);
        resultItems.scrollIntoView({ behavior: "smooth"})
    }
    
        document.getElementById("random-meal-container").addEventListener("click", function () {
            // Show the modal
            document.getElementById("myModal").style.display = "flex";
        });
    
        // Close the modal when the close button or outside the modal is clicked
        document.querySelector(".close").addEventListener("click", function () {
            document.getElementById("myModal").style.display = "none";
        });

    // Add this part to close the modal when pressing the Escape key
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && document.getElementById("myModal").style.display === "block") {
            document.getElementById("myModal").style.display = "none";
        }
    });
    