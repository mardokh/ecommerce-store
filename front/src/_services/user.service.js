// IMPORT MODULES //
import Axios from "./caller.service"
import { tokenService } from "./token.service"



// USER ADD //
let userAdd = (credentials) => {
    return Axios.put('/user/add', credentials)
}


// USER GET //
let getUser = (userId) => {
    return Axios.get('/user/'+userId)
}


// USER AUTH //
let userLogin = (credentials) => {
    return Axios.post('/user/login', credentials)
}


let saveToken = (token) => {
    localStorage.setItem('user_token', token)
}


let isLogged = () => {
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem('user_token')

        if (token) {
            tokenService.checkSessionJwt({token: token})
                .then(res => {
                    if (res.data && res.data.message) {
                        resolve(true)
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        resolve(false)
                    }
                    reject(err)
                })
        } else {
            resolve(false)
        }
    })
}


let logout = () => {
    localStorage.removeItem('user_token')
}



// EXPORT MODULES //
export const UserService = {
    userAdd, getUser, userLogin, saveToken, isLogged, logout
}