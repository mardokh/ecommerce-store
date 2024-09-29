// IMPORT MODULES //
import Axios from "./caller.service"


let searchBar = (searchTerm) => {
    return Axios.get('/search?q='+searchTerm)
}


// EXPORTS //
export const searchBarService = {
    searchBar
}