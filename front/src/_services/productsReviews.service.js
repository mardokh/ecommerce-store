// MODULES IMPORTS //
import Axios from "./caller.service"


// GET REVIEWS //
let getProductReview = (productId) => {
    return Axios.get(`/reviews/products/${productId}`)
}

// CREATE REVIEW //
let createProductReview = (prodNote) => {
    return Axios.put('/reviews/products/create', prodNote)
}

// UPDATE REVIEW //
let updateProductReview = (newReview) => {
    return Axios.patch('/reviews/products/update', newReview)
}

// DELETE REVIEW //
let deleteProductReview = (reviewId, userId, productId) => {
    return Axios.delete(`/reviews/products/delete/${reviewId}/${userId}/${productId}`)
}


// EXPORTS //
export const productsReviewsService = {
    createProductReview, getProductReview, deleteProductReview, updateProductReview
}