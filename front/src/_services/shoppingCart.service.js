// MODULES IMPORTS //
import Axios from "./caller.service"


let shoppingGet = () => {
    return Axios.get('/shopping/carts')
}

let shoppingCreate = (cartItem) => {
    return Axios.put('/shopping/carts/create', cartItem)
}

let shoppingDelete = (productId, limitOne) => {
    return Axios.delete(`/shopping/carts/delete/${productId}/${limitOne}`)
}


// EXPORTS //
export const shoppingSerive = {
    shoppingGet, shoppingCreate, shoppingDelete
}