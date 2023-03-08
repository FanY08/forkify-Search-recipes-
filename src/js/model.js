import { async } from 'regenerator-runtime';
import { API_URL, API_KEY, RES_PER_PAGE } from './config.js';
import { AJAX, getJSON } from './helpers.js';

const dataNorm = function (data) {
  const { recipe, _links } = data;
  //   const end = recipe.uri.indexOf('?');
  const start = recipe.uri.indexOf('_');
  //   console.log(start, end);

  return {
    id: recipe.uri.slice(start + 1),
    title: recipe.label,
    publisher: recipe.source,
    sourceUrl: recipe.url,
    image: recipe.image,
    servings: recipe.yield,
    cookingTime: recipe.totalTime,
    ingredients: recipe.ingredients,
    _links: _links,
    ...(recipe.key && { key: recipe.key }), // 存在这个属性才会创建
  };
};

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?${API_KEY}`);
    state.recipe = dataNorm(data);
    if (state.bookmarks.some(b => b.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temp error handling
    console.error(`${err.message} 💥`);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    // API 一次respose所有数据
    // state.search.query = querry;
    // let data = await getJSON(`${API_URL}?${API_KEY}&q=${querry}`); //&diet=balanced&health=alcohol-free&cuisineType=American&mealType=Breakfast&mealType=Dinner&mealType=Lunch&mealType=Snack&mealType=Teatime&dishType=Main%20course&imageSize=REGULAR&random=false&field=uri&field=label&field=image&field=source&field=url&field=shareAs&field=yield&field=dietLabels&field=healthLabels&field=cautions&field=ingredientLines&field=ingredients&field=calories&field=glycemicIndex&field=totalCO2Emissions&field=co2EmissionsClass&field=totalWeight&field=totalTime&field=cuisineType&field=mealType&field=dishType&field=totalNutrients&field=totalDaily&field=digest&field=tags
    // const {
    //   hits,
    //   _links: { next },
    // } = data;
    // console.log(next);
    // state.search.results = data.hits.map(rec => dataNorm(rec));

    // API 每次只respose20个
    state.search.query = query;
    await AJAX(`${API_URL}?${API_KEY}&q=${query}`)
      .then(async res => {
        const data = await res;
        const {
          hits,
          _links: { next },
        } = data;
        state.search.results = hits.map(rec => dataNorm(rec));
        return AJAX(next.href);
      })
      .then(async res => {
        const data = await res;
        const {
          hits,
          _links: { next },
        } = data;
        state.search.results.push(...hits.map(rec => dataNorm(rec)));
        return AJAX(next.href);
      })
      .then(async res => {
        const data = await res;
        const {
          hits,
          _links: { next },
        } = data;
        state.search.results.push(...hits.map(rec => dataNorm(rec)));
      });
  } catch (err) {
    console.log(`${err.message} 💥💥`);
    throw err;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  const start = 0 + (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.cookingTime =
    (state.recipe.cookingTime * newServings) / state.recipe.servings;
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  // delete bookmark
  state.bookmarks.splice(index, 1);

  // Mark current recipe as Not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/* // 所使用的API没有接口
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :'
          );
        const [quantity, unit, description] = ingArr;
        console.log(ingArr);
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      label: newRecipe.title,
      url: newRecipe.sourceUrl,
      image: newRecipe.image,
      source: +newRecipe.publisher,
      totalTime: +newRecipe.cookingTime,
      ingredients,
      yield: newRecipe.servings,
    };

    const data = await AJAX(`${API_URL}/${API_KEY}`, {
      hints: [recipe],
    });
    state.recipe = creatRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

init();
// clearBookmarks()
