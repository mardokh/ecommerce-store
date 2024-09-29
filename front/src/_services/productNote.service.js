// MODULES IMPORTS //
import Axios from "./caller.service"


let productNotesAdd = (productNote) => {
    return Axios.put('/products/notes/add', productNote)
}


// EXPORTS //
export const productNoteService = {
    productNotesAdd
}