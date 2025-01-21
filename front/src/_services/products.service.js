// IMPORT MODULES //
import Axios from "./caller.service"


let getAllproducts = () => {
    return Axios.get('/products')
}

let getOneProduct = (productId) => {
    return Axios.get('/products/'+productId)
}

let createProduct = (product) => {
    return Axios.put('/products/create', product)
}

let updateProcut = (product) => {
    return Axios.patch('/products/update', product)
}

let deleteProduct = (productId) => {
    return Axios.delete('/products/delete/'+productId)
}

let deleteSecondaryImage = (imageId) => {
    return Axios.delete('/products/secondaryimage/'+imageId)
}


// EXPORTS //
export const productService = { 
    getAllproducts, getOneProduct, createProduct, updateProcut, deleteProduct, deleteSecondaryImage 
}