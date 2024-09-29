import React, { useState } from "react"
import AddAdmin from "./addAdmin"
import AdminLogin from "./Login"
import "../../styles/pages.admin/LoginRegister.css"


const LoginRegister = () => {

    // STATES //
    const [loginActive, setLoginActive] = useState(true)
    const [registerActive, setRegisterActive] = useState(false)


    // LOGIN DISPLAYING MANAGE //
    const loginDisplay = () => {
        setLoginActive(true)
        setRegisterActive(false)
    }


    // REGISTER DISPLAYING MANAGE //
    const registerDisplay = () => {
        setRegisterActive(true)
        setLoginActive(false)
    }


    return (
        <div className="loginRegister_global_container">

            <div className="loginRegister_parent_container">

                <div className="loginRegister_switch_container">
                    <div className="loginRegister_switch_sub_container">
                        <button className={"loginRegister_connexion_btn "+(loginActive && "login_active")} onClick={loginDisplay}>se connecter</button>
                        <button className={"loginRegister_register_btn "+(registerActive && "login_active")} onClick={registerDisplay}>cree un compte</button>
                    </div>
                </div>

                <div className={"loginRegister_components_container"}>
                    {loginActive &&
                        <div className="loginRegister_components_item">
                            <AdminLogin/>
                        </div>
                    }
                    {registerActive &&
                        <div className="loginRegister_components_item">
                            <AddAdmin/>
                        </div>
                    }
                </div>

            </div>

        </div>
    )
}


export default LoginRegister