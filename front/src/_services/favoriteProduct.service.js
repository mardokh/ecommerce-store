// MODULES IMPORTS //
import Axios from "./caller.service"



let favoriteProductAdd = (favProduct) => {
    return Axios.put('/favorites/products/add', favProduct)
}

let favoriteProductGetAll = () => {
    return Axios.get('/favorites/products')
}

let favoriteProductDelete = (favProductId) => {
    return Axios.delete('/favorites/products/delete/'+favProductId)
}

let favoriteProductCount = () => {
    return Axios.get('/favorites/products/count')
}



// EXPORTS //
export const favoriteProductService = {
    favoriteProductAdd, favoriteProductGetAll, favoriteProductDelete, favoriteProductCount
}