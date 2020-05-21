const search = document.getElementById('search');
const submit = document.getElementById('submit');
const random = document.getElementById('random');
const mealsEl = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const single_mealEl = document.getElementById('single-meal')
const resultTitle = document.getElementById('search-result')
//search meal and fetch from API
const searchMeal = async (e) => {
  e.preventDefault();

  //clear single meal
  single_mealEl.innerHTML = '';

  // get the search term
  const term = search.value;


  const getMeal = async (term) => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const data = await res.json();
    return data;
  }

  // check for empty
  if (term.trim()) {
    getMeal(term)
      .then(res => { 
        resultTitle.innerHTML = `<h2>Search result for ${term}:</h2>`
        if (res.meals === null) {
          resultHeading.innerHTML = '<p>There are no search result. Please try again!</p>'
        } else {
          resultHeading.innerHTML = res.meals.map(meal => (`
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealId= "${meal.idMeal}">
              <h3>
              ${meal.strMeal}
              </h3>
            </div>
          </div>`
          ))
          .join('')

        }
      }
      )
    // clear search text
    search.value = '';
  } else {
    alert('Please enter a search term')
  }

}



//event listeners

submit.addEventListener('submit', searchMeal);
// random.addEventListener('click', randomMeal)