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

  //fetch meal by term search
  const getMeal = async (term) => {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`);
    const data = await res.json();
    return data
  }

  // check for empty
  if (term.trim()) {
    getMeal(term)
      .then(res => {
        if (res.meals === null) {
          resultHeading.innerHTML = '<p>There are no search result. Please try again!</p>';
        } else {
          resultHeading.innerHTML = `<h2>Search result for ${term}:</h2>`;
          mealsEl.innerHTML = res.meals.map(meal => (`
          <div class="meal">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="meal-info" data-mealId= "${meal.idMeal}">
              <h3>
              ${meal.strMeal}
              </h3>
            </div>
          </div>`
          ))
            .join('');

        }
      })
    // clear search text
    search.value = '';
  } else {
    alert('Please enter a search term');
  }
};

//fetch meal by ID
const getMealById = async (mealID) => {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  const data = await res.json();
  const meal = data.meals[0];

  addMealToDOM(meal);
};

// add meal to DOM
const addMealToDOM = (meal) => {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory} </p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea} </p>` : ''}
    </div>
    <div class="main">
      <h2>Ingredients</h2>
    <ul>
      ${ingredients.map(ingredient =>
    `<li>${ingredient}</li>`
  ).join('')}
    </ul>
    <h2>Method:</h2>
    <p>${meal.strInstructions}</p>
    </div>
  </div>
  `
};

//fetch random Meal
const getRandomMeal = async () => {
  //clear meals and heading
  mealsEl.innerHTML = '';
  resultHeading.innerHTML = '';

  const res = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
  const data = await res.json();
  const meal = data.meals[0];

  addMealToDOM(meal)
};


//event listeners

submit.addEventListener('submit', searchMeal);
random.addEventListener('click', getRandomMeal);

mealsEl.addEventListener('click', e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains('meal-info')
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealId = mealInfo.getAttribute('data-mealid')
    getMealById(mealId);
  }
});

