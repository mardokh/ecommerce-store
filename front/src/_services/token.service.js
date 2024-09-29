// IMPORT MODULES //
import Axios from "./caller.service"


let checkSessionJwt = (token) => {
    return Axios.post('/session/jwt', token)
}


export const tokenService = {
    checkSessionJwt
}