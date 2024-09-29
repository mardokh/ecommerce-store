// MODULES IMPORTS //
import Axios from "./caller.service"


let recipeNotesAdd = (recipeNote) => {
    return Axios.put('/recipes/notes/add', recipeNote)
}


// EXPORTS //
export const recipeNoteService = {
    recipeNotesAdd
}