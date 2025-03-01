// MODULES IMPORTS //
import Axios from "./caller.service"


// GET CATEGORIES NAMES //
let categoriesNamesGet = () => {
    return Axios.get('/categories/names')
}

// CREATE CATEGORY //
let categorieCreate = (category) => {
    return Axios.put('/categories/category', {category})
}

// DELETE CATEGORY //
let categoryDelete = (categoryId) => {
    return Axios.delete(`/categories/category/${categoryId}`)
}


// EXPORTS //
export const categoriesService = {
    categoriesNamesGet, categorieCreate, categoryDelete
}