// MODULES IMPORTS //
import Axios from "./caller.service"


// GET CATEGORIES NAMES //
let categoriesNamesGet = () => {
    return Axios.get('/categories/names')
}

// GET CATEGORIES BY FILTER //
let categoriesFilterGet = () => {
    return Axios.get('/categories')
}

// CREATE CATEGORY //
let categorieCreate = () => {
    return Axios.put('/categories/category')
}


// EXPORTS //
export const categoriesService = {
    categoriesNamesGet, categoriesFilterGet, categorieCreate
}