import React, { useState } from "react"
import "../../styles/pages.user/singIn.css"
import { UserService } from "../../_services/user.service"
import BouncingDotsLoader from "../../_utils/customeLoader/dotsLoader"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"


const SingIn = () => {

    // STATE //
    const [credentials, setCredentials] = useState({email: "", password: ""})
    const [loginFailed, setLoginFailed] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [loader, setLoader] = useState(false)


    // REDIRECTION //
    const navigate = useNavigate()


    // ON LOGS INPUT //
    const handleInputChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }


    // ON FORM SUBMIT //
    const submitFrom = async (e) => {
        e.preventDefault()
        setLoader(true)
        try {
            const res = await UserService.userLogin(credentials)
            UserService.saveToken(res.data.data.access_token)
            Cookies.set('userId', res.data.data.user_id, { expires: 1/24 })
            navigate(`/user/account/${res.data.user_id}`)
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
        <div className="user_connection_form_container">
            <p className="user_connection_form_title">connecter vous</p>
            <form className="user_connection_form" onSubmit={submitFrom}>
                <div className="user_connection_input_container">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Adresse e-mail" 
                        onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        required
                    />
                    {emailError.length > 0 &&
                        <p className='user_connection_error'>{emailError}</p>
                    }
                </div>
                <div className="user_connection_input_container">
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Mot de passe" 
                        onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                        required
                    />
                    {passwordError.length > 0 &&
                        <p className='user_connection_error'>{passwordError}</p>
                    }
                </div>
                <div className="user_connection_input_container user_connection_input_container_submit_btn">
                    {loader ? <BouncingDotsLoader/> : <input type="submit" value="connexion"/>}
                </div>
                {loginFailed.length > 0 &&
                    <div className="user_connection_failed_container">
                        <p>{loginFailed}</p>
                    </div>
                }
                <div className="user_connection_forget_pass_container">
                    <p>mot de passe oublier ?</p>
                    <p className="user_connection_inscription">Vous n'avez pas encore de compte ? <span><Link to="/sing_up">S'inscrire</Link></span></p>
                </div>
            </form>
        </div>
    )
}


export default SingIn