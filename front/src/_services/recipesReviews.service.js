// MODULES IMPORTS //
import Axios from "./caller.service"


// GET ALL REVIEWS //
let getRecipesReviews = (recipeId) => {
    return Axios.get(`/reviews/recipes/${recipeId}`)
}

// CREATE REVIEW //
let createRecipesReviews = (recipeNote) => {
    return Axios.put('/reviews/recipes/create', recipeNote)
}

// UPDATE REVIEW //
let updateRecipesReviews = (newReview) => {
    return Axios.patch('/reviews/recipes/update', newReview)
}

// DELETE REVIEW //
let deleteRecipesReviews = (reviewId, userId, recipeId) => {
    return Axios.delete(`/reviews/recipes/delete/${reviewId}/${userId}/${recipeId}`)
}


// EXPORTS //
export const recipesReviewsService = {
    getRecipesReviews, createRecipesReviews, updateRecipesReviews, deleteRecipesReviews
}