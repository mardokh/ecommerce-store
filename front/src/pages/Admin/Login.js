import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AdminService } from "../../_services/admin.service"
import '../../styles/pages.admin/login.css'
import logo from '../../images/logo.png'
import BouncingDotsLoader from "../../_utils/customeLoader/dotsLoader"


const AdminLogin = () => {

    // STATES //
    const [credentials, setCredentials] = useState({email: "", password: ""})
    const [loader, setLoader] = useState(false)
    const [loginFailed, setLoginFailed] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    

    // REDIRECTION //
    const navigate = useNavigate()


    // ON INPUT LOGS //
    const handleInputChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }


    // ON FORM SUBMIT//
    const submitFrom = async (e) => {
        e.preventDefault()
        setLoader(true)
        try {
            const res = await AdminService.adminLogin(credentials)
            AdminService.saveToken(res.data.data.access_token)
            navigate("/admin")
        }
        catch (err) {
            if (err.response && err.response.status === 401) {
                setLoader(false)
                setLoginFailed(err.response.data.message)
            } else {
                setLoader(false)
                console.log('Error:', err.message)
            }
        }
    }


    // INPUTS ERRORS HANDLER //
    const handleFieldsErrors = (name, value) => {
        if (name === 'email') {
            if (!value) {
                setEmailError("Une adresse e-mail est requise")
            } else {
                setEmailError("")
                handleInputChange(name, value)
            }
        }
        if (name === 'password') {
            if (!value)  {
                setPasswordError("Un mot de passe est requis")
            } else {
                setPasswordError("")
                handleInputChange(name, value)
            }
        }
    }


    return (
            <form className="loginAdmin_form_container" onSubmit={submitFrom}>
                <div className="loginAdmin_input_container">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Adresse e-mail" 
                        onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        required
                    />
                    {emailError.length > 0 &&
                        <p className='loginAdmin_error'>{emailError}</p>
                    }
                </div>
                <div className="loginAdmin_input_container">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Mot de passe" 
                        onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        required
                    />
                    {passwordError.length > 0 &&
                        <p className='loginAdmin_error'>{passwordError}</p>
                    }
                </div>
                <div className="loginAdmin_input_container">
                    {loader ? <BouncingDotsLoader/> : <input className="loginAdmin_submit_btn" type="submit" value="connexion"/>}
                </div>
                {loginFailed.length > 0 &&
                    <div className="loginAdmin_connection_failed_container">
                        <p>{loginFailed}</p>
                    </div>
                }
                <div>
                    <p className="loginAdmin_forget_pass">Mot de passe oublier ?</p>
                </div>
            </form>
    )
}


export default AdminLogin