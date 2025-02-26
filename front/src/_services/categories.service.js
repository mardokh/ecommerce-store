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
let categorieCreate = (category) => {
    console.log(category)
    return Axios.put('/categories/category', {category})
}


// EXPORTS //
export const categoriesService = {
    categoriesNamesGet, categoriesFilterGet, categorieCreate
}