import React, { useState } from "react"
import "../../styles/pages.user/singIn.css"
import { UserService } from "../../_services/user.service"
import BouncingDotsLoader from "../../_utils/customeLoader/dotsLoader"
import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { Link } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"


const SignIn = () => {

    // STATE //
    const [loginFailed, setLoginFailed] = useState("")
    const [loginFailedDisplay, setLoginFailedDisplay] = useState(false)

    // REDIRECTION //
    const navigate = useNavigate()

    // Handle errors
    const handleError = (err) => {
        if (err.response && err.response.status === 401) {
            setLoginFailed(err.response.data.message)
            setLoginFailedDisplay(true)
        } else {
            console.log('Error:', err.message)
        }
    }

    // **Validation Schema (Same as Backend)**
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Adresse email invalide")
            .required("Une adresse email est requise"),
        password: Yup.string()
            .required("Un mot de passe est requis"),
    });

    // **Form Submission**
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const res = await UserService.userLogin(values)
            UserService.saveToken(res.data.data.access_token)
            Cookies.set('userId', res.data.data.user_id, { expires: 1 / 24 })
            navigate(`/user/account/${res.data.user_id}`)
        } catch (err) {
            handleError(err)
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <div className="user_connection_form_container">
            <p className="user_connection_form_title">Connectez-vous</p>
            
            <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="user_connection_form_sing_in">
                        <div className="user_connection_input_container">
                            <Field type="email" name="email" placeholder="Adresse e-mail" />
                            <ErrorMessage name="email" component="div" className="sing-in-error-message" />
                        </div>
                        <div className="user_connection_input_container">
                            <Field type="password" name="password" placeholder="Mot de passe" />
                            <ErrorMessage name="password" component="div" className="sing-in-error-message" />
                        </div>
                        <div className="user_connection_input_container user_connection_input_container_submit_btn">
                            <button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <BouncingDotsLoader /> : "Connexion"}
                            </button>
                        </div>
                        {loginFailedDisplay && (
                            <div className="user_connection_failed_container">
                                <p>{loginFailed}</p>
                            </div>
                        )}
                        <div className="user_connection_forget_pass_container">
                            <p>Mot de passe oublié ?</p>
                            <p className="user_connection_inscription">
                                Vous n'avez pas encore de compte ? <span><Link to="/sing_up">S'inscrire</Link></span>
                            </p>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


export default SignIn
