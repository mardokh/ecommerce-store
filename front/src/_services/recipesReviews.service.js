// MODULES IMPORTS //
import Axios from "./caller.service"


// GET ALL REVIEWS //
let getRecipesReviews = (recipeId) => {
    return Axios.get(`/reviews/recipes?recipeId=${recipeId}`)
}

// ADD REVIEW //
let addRecipesReviews = (recipeNote) => {
    return Axios.put('/reviews/recipes/add', recipeNote)
}

// UPDATE REVIEW //
let updateRecipesReviews = (newReview) => {
    return Axios.patch('/reviews/recipes/update', newReview)
}

// DELETE REVIEW //
let deleteRecipesReviews = (recipeId) => {
    return Axios.delete('/reviews/recipes/delete/'+recipeId)
}


// EXPORTS //
export const recipesReviewsService = {
    getRecipesReviews, addRecipesReviews, updateRecipesReviews, deleteRecipesReviews
}