// IMPORT MODULES //
import Axios from "./caller.service"

let getAllRecipes = () => {
    return Axios.get('/recipes')
}

let getOneRecipe = (recipeId) => {
    return Axios.get('/recipes/'+recipeId)
}

let createRecipe = (recipe) => {
    return Axios.put('/recipes/create', recipe)
}

let updateRecipe = (recipe) => {
    return Axios.patch('/recipes/update', recipe)
}

let deleteRecipe = (recipeId) => {
    return Axios.delete('/recipes/delete/'+recipeId)
}



// EXPORTS //
export const recipeService = {
    getAllRecipes, getOneRecipe, createRecipe, updateRecipe, deleteRecipe
}