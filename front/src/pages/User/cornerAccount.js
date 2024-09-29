import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/pages.user/cornerAccount.css"
import { UserService } from "../../_services/user.service"
import Cookies from 'js-cookie'
import CustomLoader from '../../_utils/customeLoader/customLoader'


const CornerAccount = () => {

    // STATES //
    const [user, setUser] = useState({})
    const [isLoad, setISload] = useState(false)


    // NAVIGATE //
    const navigate = useNavigate()


    // GET LOGIN COOKIE //
    const loginUserId =  Cookies.get('userId')


    // GET USER FUNCTION //
    const getUserCorner = async () => {

        try {
            // Check if login cookie exist
            if (loginUserId) {

                // Check token validity
                const res =  await UserService.isLogged()

                // Get user
                if (res === true) {
                    const userData = await UserService.getUser(loginUserId)
                    
                    // Update state
                    setUser(userData.data.data)

                    setISload(true)
                }
            }
        }
        catch (err) {
            console.error('Error :', err)
        }
    }

    
    // GET USER ON LOAD //
    useEffect(() => {
        getUserCorner()
    }, [])


    // Loader //
    if (!isLoad) {
        return <CustomLoader/>
    }


    return (
        <div className="cornerAccount_globale_container">
            <div className="cornerAccount_hello_container">
                <p>Bonjour</p>
                <p>{user.firstName + " " + user.lastName}</p>
            </div>
        </div>
    )
}



export default CornerAccount