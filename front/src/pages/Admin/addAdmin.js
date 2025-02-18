import React, { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { AdminService } from "../../_services/admin.service"
import "../../styles/pages.admin/addAdmin.css"
import {lastFirstMaxLength, lastFirstFormatAccept, emailMaxLength, 
    emailFormatAccept, passwordMaxLength, passwordDigit, passwordForbidden,
    passwordUppercase, passwordLowercase
} from '../../_utils/regex/admin/adminSingUp.regex'


const AddAdmin = () => {

    // STATES //
    const [credentials, setCredentials] = useState({lastName: "", firstName: "", email: "", password: ""})
    const [emailExist, setEmailExist] = useState(false);
    const [emailExistMessage, setEmailExistMessage] = useState(false);
    const [lastNameError,setLastNameError] = useState("")
    const [firstNameError, setFirstNameError] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")


    // REDIRECTION //
    const navigate = useNavigate()


    // GET INPUTS //
    const handleInputChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }


    // Submit function
    const submitForm = async (e) => {
        e.preventDefault()
        if (!credentials.lastName || !credentials.firstName || !credentials.email || !credentials.password) {
            if (!credentials.lastName) setLastNameError("Votre Nom est requis");
            if (!credentials.firstName) setFirstNameError("Votre prenom est requis");
            if (!credentials.email) setEmailError("Une adresse e-mail est requise");
            if (!credentials.password) setPasswordError("Un mot de passe est requis");
            return;
        } 
        try {
            const res = await AdminService.adminCreate(credentials)
            console.log('from admin : ', res)
            AdminService.saveToken(res.data.data.access_token)
            navigate('/admin')
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

    // INPUTS ERRORS HANDLER //
    const handleFieldsErrors = (name, value) => {
        if (name === 'lastName') {
            if (!value) {
                setLastNameError("Votre Nom est requis")
            } else if (!lastFirstMaxLength.test(value)) {
                setLastNameError("Votre Nom ne doit pas dépasser 50 caractères")
            } else if (!lastFirstFormatAccept.test(value)) {
                setLastNameError("Votre Nom doit contenir seulement des lettres et des espaces")
            } else {
                setLastNameError("")
                handleInputChange(name, value)
            }
        }
        if (name === 'firstName') {
            if (!value) {
                setFirstNameError("Votre Prenom est requis")
            } else if (!lastFirstMaxLength.test(value)) {
                setFirstNameError("Votre Prenom ne doit pas dépasser 50 caractères")
            } else if (!lastFirstFormatAccept.test(value)) {
                setFirstNameError("Votre Prenom doit contenir seulement des lettres et des espaces")
            } else {
                setFirstNameError("")
                handleInputChange(name, value)
            }
        }
        if (name === 'email') {
            if (!value) {
                setEmailError("Une adresse e-mail est requise")
            } else if (!emailMaxLength.test(value)) {
                setEmailError("Votre adresse e-mail ne doit pas dépasser 50 caractères")
            } else if (!emailFormatAccept.test(value)) {
                setEmailError("Votre e-mail doit etre une adresse valide")
            } else {
                setEmailError("")
                handleInputChange(name, value)
            }
        }
        if (name === 'password') {
            if (!value)  {
                setPasswordError("Un mot de passe est requis")
            } else if (!passwordMaxLength.test(value)) {
                setPasswordError("Votre mot de passe doit contenir entre 8 et 20 caractères")
            } else if (!passwordDigit.test(value)) {
                setPasswordError("Votre mot de passe doit contenir au moins un chiffre")
            } else if (!passwordUppercase.test(value)) {
                setPasswordError("Votre mot de passe doit contenir au moins une lettre majuscule")
            } else if (!passwordLowercase.test(value)) {
                setPasswordError("Votre mot de passe doit contenir au moins une lettre minuscule")
            } else if (!passwordForbidden.test(value)) {
                setPasswordError("Votre mot de passe contient des caractères invalides")
            } else {
                setPasswordError("")
                handleInputChange(name, value)
            }
        }
    }


    return (
        <form className="addAdmin_form_container" onSubmit={submitForm}>
            <div className="addAdmin_input_container">
                <input 
                    type="text" 
                    name="lastName"
                    placeholder="Nom"
                    onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)} 
                    onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                />
                {lastNameError.length > 0 &&
                    <p className='addAdmin_inscription_error'>{lastNameError}</p>
                }
            </div>
            <div className="addAdmin_input_container">
                <input 
                    type="text"
                    name="firstName"
                    placeholder="Prenom"
                    onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)} 
                    onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                />
                {firstNameError.length > 0 &&
                    <p className='addAdmin_inscription_error'>{firstNameError}</p>
                }
            </div>
            <div className="addAdmin_input_container">
                <input 
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)} 
                    onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                />
                {emailError.length > 0 &&
                        <p className='addAdmin_inscription_error'>{emailError}</p>
                }
                {emailExist &&
                        <p className="addAdmin_inscription_email_exist">{emailExistMessage}</p>
                }
            </div>
            <div className="addAdmin_input_container">
                <input 
                    type="password"
                    name="password"
                    placeholder="password"
                    onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)} 
                    onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                />
                {passwordError.length > 0 &&
                    <p className='addAdmin_inscription_error'>{passwordError}</p>
                }
            </div>
            <div className="addAdmin_input_container">
                <input className="addAdmin_submit_btn" type="submit" value="confirmer"/>
            </div>
        </form>
    )
}


export default AddAdmin