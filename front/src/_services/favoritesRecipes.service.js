// MODULES IMPORTS //
import Axios from "./caller.service"



let favoriteRecipeCreate = (favRecipe) => {
    return Axios.put('/favorites/recipes/create', favRecipe)
}

let favoriteRecipeGetAll = () => {
    return Axios.get('/favorites/recipes')
}

let favoriteRecipeDelete = (favRecipeId) => {
    return Axios.delete('/favorites/recipes/delete/'+favRecipeId)
}


// EXPORTS //
export const favoriteRecipeService = {
    favoriteRecipeCreate, favoriteRecipeGetAll, favoriteRecipeDelete
}