import React, { useState } from "react"
import "../../styles/pages.user/singIn.css"
import { UserService } from "../../_services/user.service"
import BouncingDotsLoader from "../../_utils/customeLoader/dotsLoader"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"


const SingIn = () => {

    // STATE //
    const [credentials, setCredentials] = useState({})
    const [loader, setLoader] = useState(false)
    const [loginFailed, setLoginFailed] = useState("")
    const [loginFailedDisplay, setLoginFailedDisplay] = useState(false)


    // REDIRECTION //
    const navigate = useNavigate()


    // ON LOGS INPUT //
    const inputChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }


    // Handle errors
    const handleError = (err) => {
        if (err.response && err.response.status === 401) {
            setLoginFailed(err.response.data.message)
            setLoginFailedDisplay(true)
        } else {
            console.log('Error:', err.message)
        }
    }


    // ON FORM SUBMIT //
    const submitFrom = async (e) => {
        e.preventDefault()

        try {
            // Api call for send credentials
            const res = await UserService.userLogin(credentials)

            // Save token to local storage
            UserService.saveToken(res.data.access_token)

            // Set connected cookie
            Cookies.set('userId', res.data.user_id, { expires: 1/24 })

            // Redirect
            navigate(`/user/account/${res.data.user_id}`)
        }

        catch (err) {
            handleError(err)
        }
    }


    return (
        <div className="user_connection_form_container">
            <p className="user_connection_form_title">connecter vous</p>
            <form className="user_connection_form" onSubmit={submitFrom}>
                <div className="user_connection_input_container">
                    <input type="email" name="identifiant" placeholder="votre adresse email" onChange={(e) => inputChange(e.target.name, e.target.value)} />
                </div>
                <div className="user_connection_input_container">
                    <input type="password" name="password" placeholder="mot de passe" onChange={(e) => inputChange(e.target.name, e.target.value)} />
                </div>
                <div className="user_connection_input_container user_connection_input_container_submit_btn">
                    <input type="submit" value="connexion" />
                </div>
                {loginFailedDisplay &&
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