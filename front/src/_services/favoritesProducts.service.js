// MODULES IMPORTS //
import Axios from "./caller.service"


// GET FAVORTIES //
let favoriteProductGetAll = () => {
    return Axios.get('/favorites/products')
}

// CREATE FAVORITE //
let favoriteProductCreate = (favProduct) => {
    return Axios.put('/favorites/products/create', favProduct)
}

// DELETE FAVORITE //
let favoriteProductDelete = (favProductId) => {
    return Axios.delete('/favorites/products/delete/'+favProductId)
}


// EXPORTS //
export const favoriteProductService = {
    favoriteProductCreate, favoriteProductGetAll, favoriteProductDelete
}