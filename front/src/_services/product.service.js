// IMPORT MODULES //
import Axios from "./caller.service"


let getAllproducts = () => {
    return Axios.get('/products')
}

let getOneProduct = (productId) => {
    return Axios.get('/products/'+productId)
}

let getProductNote = (productId) => {
    return Axios.get('/products/note/'+productId)
}

let addProduct = (product) => {
    return Axios.put('/products/add', product)
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
    getAllproducts, getOneProduct, addProduct, updateProcut, deleteProduct, deleteSecondaryImage, getProductNote 
}