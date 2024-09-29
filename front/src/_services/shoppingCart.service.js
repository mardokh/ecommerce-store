// MODULES IMPORTS //
import Axios from "./caller.service"


let shoppingGet = () => {
    return Axios.get('/shopping/carts')
}

let shoppingAdd = (cartItem) => {
    return Axios.put('/shopping/carts/add', cartItem)
}

let shoppingDelete = (cartItem) => {
    return Axios.delete('/shopping/carts/delete/'+cartItem)
}

let shoppingSomesDelete = (cartItem) => {
    return Axios.delete('/shopping/carts/delete/somes/'+cartItem)
}

let shoppingCount = () => {
    return Axios.get('/shopping/carts/count')
}

// EXPORTS //
export const shoppingSerive = {
    shoppingGet, shoppingAdd, shoppingDelete, shoppingSomesDelete, shoppingCount
}