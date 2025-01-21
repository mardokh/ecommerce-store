// MODULES IMPORTS //
import Axios from "./caller.service"


let favoriteProductCreate = (favProduct) => {
    return Axios.put('/favorites/products/create', favProduct)
}

let favoriteProductGetAll = () => {
    return Axios.get('/favorites/products')
}

let favoriteProductDelete = (favProductId) => {
    return Axios.delete('/favorites/products/delete/'+favProductId)
}


// EXPORTS //
export const favoriteProductService = {
    favoriteProductCreate, favoriteProductGetAll, favoriteProductDelete
}