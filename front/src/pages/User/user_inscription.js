import React, { useState, useRef, useContext } from "react"
import "../../styles/pages.user/user_inscription.css"
import { UserService } from "../../_services/user.service"
import MyContext from '../../_utils/contexts'


const UserInscription = () => {

    // STATE //
    const [credentials, setCredentials] = useState({})
    const [successInscription, setSuccessInscription] = useState("")
    const [displaySuccessMessage, setDisplaySuccessMessage] = useState(false)
    const [emailExist, setEmailExist] = useState(false)
    const [emailExistMessage , setEmailExistMessage] = useState(false)


    // CONTEXTS //
    const { updateSumbitSwitch } = useContext(MyContext)


    const lastNameRef = useRef(null)
    const firstNameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)


    // GET INPUTS //
    const inputChange = (name, value) => {
        setCredentials({
            ...credentials,
            [name]: value
        })
    }


    // Handle errors
    const handleError = (err) => {
        if (err.response && err.response.status === 409) {
            setEmailExist(true)
            setEmailExistMessage(err.response.data.message)
        } else {
            console.log('Error:', err.message)
        }
    }


    // SUBMIT FORM //
    const submitForm = async (e) => {
        e.preventDefault()

        try {
            // Api call for send credentials
            const res = await UserService.userAdd(credentials)

            // Get success message
            setSuccessInscription(res.data.message)

            // Reset inputs
            lastNameRef.current.value = ""
            firstNameRef.current.value = ""
            emailRef.current.value = ""
            passwordRef.current.value = ""

            // Display success message
            setDisplaySuccessMessage(true)

            setTimeout(() => {
                setDisplaySuccessMessage(false)
                updateSumbitSwitch(true)
            }, 1100)
        }
        catch (err) {
            handleError(err)
        }
    }



    return (
        <div className="user_inscription_form_global_container">
            <form className="user_inscription_form_container" onSubmit={submitForm}>
                <div className="user_inscription_inputs">
                    <input type="text" name="lastName" ref={lastNameRef} placeholder="Nom" onChange={(e) => inputChange(e.target.name ,e.target.value)}/>
                </div>
                <div className="user_inscription_inputs">
                    <input type="text" name="firstName" ref={firstNameRef} placeholder="Prenom" onChange={(e) => inputChange(e.target.name ,e.target.value)}/>
                </div>
                <div className="user_inscription_inputs">
                    <input type="email" name="email" ref={emailRef} placeholder="Email" onChange={(e) => inputChange(e.target.name ,e.target.value)}/>
                    {emailExist &&
                        <p className="user_inscription_email_exist">{emailExistMessage}</p>
                    }
                </div>
                <div className="user_inscription_inputs">
                    <input type="password" name="password" ref={passwordRef} placeholder="Mot de passe" onChange={(e) => inputChange(e.target.name ,e.target.value)}/>
                </div>
                <div className="user_inscription_inputs user_inscription_submit_btn">
                    <input type="submit" value="inscription" />
                </div>
                {displaySuccessMessage &&
                    <div className="user_inscription_sucess">{successInscription}</div>
                }
            </form>
        </div>
    )
}


export default UserInscription