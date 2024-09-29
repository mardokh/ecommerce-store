// MODULES IMPORTS //
import Axios from "./caller.service"


// GET ALL REVIEWS //
let getRecipesNotesComments = (recipeId) => {
    return Axios.get(`/reviews/recipes?recipeId=${recipeId}`)
}

// ADD REVIEW //
let addRecipesNotesComments = (recipeNote) => {
    return Axios.put('/reviews/recipes/add', recipeNote)
}

// UPDATE REVIEW //
let updateRecipesNotesComments = (newReview) => {
    return Axios.patch('/reviews/recipes/update', newReview)
}

// DELETE REVIEW //
let deleteRecipesNotesComments = (recipeId) => {
    return Axios.delete('/reviews/recipes/delete/'+recipeId)
}


// EXPORTS //
export const recipesNotesCommentsService = {
    getRecipesNotesComments, addRecipesNotesComments, updateRecipesNotesComments, deleteRecipesNotesComments
}