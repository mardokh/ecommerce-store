import React, { useState, useContext } from "react";
import "../../styles/pages.user/singUp.css";
import { UserService } from "../../_services/user.service";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const SingUp = () => {

    // STATES //
    const [emailExist, setEmailExist] = useState(false);
    const [emailExistMessage, setEmailExistMessage] = useState(false);

    // REDIRECTION //
    const navigate = useNavigate()

    // Backend validation rules applied using Yup
    const validationSchema = Yup.object({
        lastName: Yup.string()
            .required("Le champ Nom est requis")
            .max(20, "Votre Nom ne doit pas excéder 20 caractères")
            .matches(/^[A-Za-z]+$/, "Votre Nom doit contenir seulement des lettres")
            .trim(),
        
        firstName: Yup.string()
            .required("Le champ Prenom est requis")
            .max(20, "Votre Prenom ne doit pas excéder 20 caractères")
            .matches(/^[A-Za-z]+$/, "Votre Prenom doit contenir seulement des lettres")
            .trim(),
        
        email: Yup.string()
            .required("Le champ Email est requis")
            .email("Votre Email doit etre une adresse valide"),

        password: Yup.string()
            .required("Le champ Mot de passe est requis")
            .min(8, "Le Mot de passe doit contenir entre 8 et 12 caractères")
            .max(12, "Le Mot de passe doit contenir entre 8 et 12 caractères")
            .matches(/\d/, "Le Mot de passe doit contenir au moins un chiffre")
            .matches(/[A-Z]/, "Le Mot de passe doit contenir au moins une lettre majuscule")
            .matches(/[a-z]/, "Le Mot de passe doit contenir au moins une lettre minuscule")
            .matches(/^[a-zA-Z0-9]*$/, "Le Mot de passe doit contenir uniquement des lettres et des chiffres")
            .trim()
    });

    // Submit function
    const submitForm = async (values) => {
        try {
            const res = await UserService.userAdd(values)
            UserService.saveToken(res.data.data.access_token)
            Cookies.set('userId', res.data.data.user_id, { expires: 1/24 })
            navigate(`/user/account/${res.data.user_id}`)
        } 
        catch (err) {
            if (err.response && err.response.status === 409) {
                setEmailExist(true);
                setEmailExistMessage(err.response.data.message)
            } else {
                console.log('Error:', err.message)
            }
        }
    }

    return (
        <div className="user_inscription_form_global_container">
            <p className="user_inscription_form_title">Cree votre compte</p>
            <Formik
                initialValues={{ lastName: '', firstName: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={submitForm}
            >
                {() => (
                    <Form className="user_inscription_form_container">
                        <div className="user_inscription_inputs">
                            <Field type="text" name="lastName" placeholder="Nom" />
                            <ErrorMessage name="lastName" component="div" className="error-message"/>
                        </div>
                        <div className="user_inscription_inputs">
                            <Field type="text" name="firstName" placeholder="Prenom" />
                            <ErrorMessage name="firstName" component="div" className="error-message"/>
                        </div>
                        <div className="user_inscription_inputs">
                            <Field type="email" name="email" placeholder="Email" />
                            <ErrorMessage name="email" component="div" className="error-message"/>
                            {emailExist && <p className="error-message">{emailExistMessage}</p>}
                        </div>
                        <div className="user_inscription_inputs">
                            <Field type="password" name="password" placeholder="Mot de passe" />
                            <ErrorMessage name="password" component="div" className="error-message"/>
                        </div>
                        <div className="user_inscription_inputs user_inscription_submit_btn">
                            <input type="submit" value="S'inscrire"/>
                        </div>
                        <p className="user_inscription_connect">
                            Vous avez deja un compte ? <span><Link to="/sing_in">Se connecter</Link></span>
                        </p>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SingUp;
