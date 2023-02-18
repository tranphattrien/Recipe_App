import * as model from "./model.js";
import { MODAL_CLOSE_SECOND } from "./config";
import recipeView from "./views/recipeView";
import searchView from "./views/searchView";
import resultsView from "./views/resultsView";
import bookmarksView from "./views/bookmarksView";
import paginationView from "./views/paginationView";
import addRecipeView from "./views/addRecipeView";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    // update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // update bookmarks view
    bookmarksView.update(model.state.bookmarks);
    // 1. Loading Recipe
    await model.loadRecipe(id);
    // 2. Rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    resultsView.renderSpinner();
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;
    // Load query
    await model.loadSearchResult(query);
    // Render result
    resultsView.render(model.getSearchResultsPage());
    // Render intial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = (goToPage) => {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controlServings = (newServings) => {
  // update recipe servings
  model.updateServings(newServings);
  // update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  // add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // update recipe view
  recipeView.update(model.state.recipe);
  // render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async (newRecipe) => {
  try {
    addRecipeView.renderSpinner();
    // upload new recipe
    await model.uploadRecipe(newRecipe);
    // render new recipe
    recipeView.render(model.state.recipe);
    //success
    addRecipeView.renderMessage();
    // render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // change id url
    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
      // reload to can continue add recipe
      location.reload();
    }, MODAL_CLOSE_SECOND * 1000);
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error);
  }
};
const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
