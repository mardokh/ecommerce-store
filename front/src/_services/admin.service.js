// IMPORT MODULES //
import Axios from "./caller.service"
import { tokenService } from "./token.service"



// ADMIN AUTH //
let adminLogin = (credentials) => {
    return Axios.post('/admin/login', credentials)
}


let saveToken = (token) => {
    localStorage.setItem('admin_token', token)
}


let isLogged = () => {
    
    return new Promise((resolve, reject) => {
        let token = localStorage.getItem('admin_token')

        if (token) {
            tokenService.checkSessionJwt({token: token})
                .then(res => {
                    if (res.data && res.data.message) {
                        resolve(true)
                    }
                })
                .catch(err => {
                    if (err.response.status === 401) {
                        console.log('erro runing')
                        resolve(err.response.role)
                    }
                    reject(err)
                })
        } else {
            console.log('end is runing')
            resolve(false)
        }
    })
}


let logout = () => {
    localStorage.removeItem('admin_token')
}



export const AdminService = {
    adminLogin, saveToken, isLogged, logout
}