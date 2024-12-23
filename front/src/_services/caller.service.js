import axios from "axios"


const Axios = axios.create({
    baseURL: `${process.env.REACT_APP_REMOTE_URL}`,
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
