// MODULES IMPORTS //
import Axios from "./caller.service"


// GET ALL REVIEWS //
let getProductReview = (productId) => {
    return Axios.get(`/reviews/products?productId=${productId}`)
}

// ADD REVIEW //
let addProductReview = (prodNote) => {
    return Axios.put('/reviews/products/add', prodNote)
}

// UPDATE REVIEW //
let updateProductReview = (newReview) => {
    return Axios.patch('/reviews/products/update', newReview)
}

// DELETE REVIEW //
let deleteProductReview = (productId) => {
    return Axios.delete('/reviews/products/delete/'+productId)
}


// EXPORTS //
export const productsReviewsService = {
    addProductReview, getProductReview, deleteProductReview, updateProductReview
}