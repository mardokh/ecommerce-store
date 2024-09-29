// MODULES IMPORTS //
import Axios from "./caller.service"


// GET ALL REVIEWS //
let getProductsNotesComments = (productId) => {
    return Axios.get(`/reviews/products?productId=${productId}`)
}

// ADD REVIEW //
let addProductsNotesComments = (prodNote) => {
    return Axios.put('/reviews/products/add', prodNote)
}

// UPDATE REVIEW //
let updateProductsNotesComments = (newReview) => {
    return Axios.patch('/reviews/products/update', newReview)
}

// DELETE REVIEW //
let deleteProductsNotesComments = (productId) => {
    return Axios.delete('/reviews/products/delete/'+productId)
}


// EXPORTS //
export const productsNotesCommentsService = {
    addProductsNotesComments, getProductsNotesComments, deleteProductsNotesComments, updateProductsNotesComments
}