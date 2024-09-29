import React, { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { UserService } from "../_services/user.service"
import CustomLoader from '../_utils/customeLoader/customLoader'
import Cookies from 'js-cookie'


const UserAuthGuard = ({ children }) => {

    // STATES //
    const [log, setLog] = useState(null)
    const [isCheckComplete, setIsCheckComplete] = useState(false)


    // GET USER CONNECTED COOOKIE //
    const userLoged = Cookies.get('userId')


    // CHECK USER TOKEN //
    useEffect(() => {
        UserService.isLogged()
            .then(res => {
                setLog(res)
                setIsCheckComplete(true)
            })
            .catch(err => console.log(err))
    }, [])


    // LOADER //
    if (!isCheckComplete || log === null) {
        return <CustomLoader/>
    }


    // REDIRECTION //
    if (log === false || !userLoged) {
        return <Navigate to="/login_inscription/main/connexion"/>
    }

    return children
}

export default UserAuthGuard