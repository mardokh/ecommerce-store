import axios from "axios"


const Axios = axios.create({
    baseURL: `http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}`,
    withCredentials: true
})


Axios.interceptors.request.use((request) => {

    const adminToken = localStorage.getItem('admin_token')
    const userToken = localStorage.getItem('user_token')

   
    if (adminToken || userToken) {
        request.headers.Authorization = `Bearer ${adminToken || userToken}`
    }
    
    return request
})



export default Axios
