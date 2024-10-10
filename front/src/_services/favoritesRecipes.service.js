// MODULES IMPORTS //
import Axios from "./caller.service"



let favoriteRecipeAdd = (favRecipe) => {
    return Axios.put('/favorites/recipes/add', favRecipe)
}

let favoriteRecipeGetAll = () => {
    return Axios.get('/favorites/recipes')
}

let favoriteRecipeDelete = (favRecipeId) => {
    return Axios.delete('/favorites/recipes/delete/'+favRecipeId)
}

let favoriteRecipeCount = () => {
    return Axios.get('/favorites/recipes/count')
}



// EXPORTS //
export const favoriteRecipeService = {
    favoriteRecipeAdd, favoriteRecipeGetAll, favoriteRecipeDelete, favoriteRecipeCount
}