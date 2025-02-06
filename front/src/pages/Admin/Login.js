import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminService } from "../../_services/admin.service"
import '../../styles/pages.admin/login.css'
import logo from '../../images/logo.png'
import BouncingDotsLoader from "../../_utils/customeLoader/dotsLoader"


const AdminLogin = () => {

    // STATES //
    const [credentials, setCredentials] = useState({})
    const [loader, setLoader] = useState(false)
    const [loginFailed, setLoginFailed] = useState("")
    const [loginFailedDisplay, setLoginFailedDisplay] = useState(false)
    

    // REDIRECTION //
    const navigate = useNavigate()


    // ON INPUT LOGS //
    const inputChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }


    // Handle errors
    const handleError = (err) => {
        setLoader(false)
        if (err.response && err.response.status === 401) {
            setLoginFailed(err.response.data.message)
            setLoginFailedDisplay(true)
        } else {
            console.log('Error:', err.message)
        }
    }


    // ON FORM SUBMIT//
    const submitFrom = async (e) => {
        e.preventDefault()

        try {
            // Loader
            setLoader(true)

            // API call for send credentials
            const res = await AdminService.adminLogin(credentials)

            // Save token to local storage
            AdminService.saveToken(res.data.data.access_token)

            // Redirect
            navigate("/admin")
        }
        
        catch (err) {
            handleError(err)
        }
    }



    return (
            <form className="loginAdmin_form_container" onSubmit={submitFrom}>
                <div className="loginAdmin_input_container">
                    <input type="email" name="email" placeholder="Adresse e-mail" onChange={(e) => inputChange(e.target.name, e.target.value)}/>
                </div>
                <div className="loginAdmin_input_container">
                    <input type="password" name="password" placeholder="Mot de passe" onChange={(e) => inputChange(e.target.name, e.target.value)}/>
                </div>
                <div className="loginAdmin_input_container">
                    <input className="loginAdmin_submit_btn" type="submit" value="connexion"/>
                </div>
                <div>
                    <p className="loginAdmin_forget_pass">Mot de passe oublier ?</p>
                </div>
            </form>
    )
}


export default AdminLogin