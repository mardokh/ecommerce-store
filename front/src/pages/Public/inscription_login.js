import React, { useContext, useEffect, useState } from "react"
import UserLogin from "../User/Login"
import UserInscription from "../User/user_inscription"
import "../../styles/pages.public/inscription_login.css"
import MyContext from '../../_utils/contexts'


const InscriptionLogin = () => {

    // STATES //
    const [switchisActive, setSwitchIsActive] = useState(false)
    const [inscriptionIsActive, setInscriptionIsActive] = useState(false)
    const [connexionIsActive, setConnexionIsActive] = useState(true)


    // CONTEXTS //
    const { sumbitSwitch } = useContext(MyContext)


    const moveSwitch = () => {
        setSwitchIsActive(!switchisActive)
        setConnexionIsActive(!connexionIsActive)
        setInscriptionIsActive(!inscriptionIsActive)
    }


    useEffect(() => {
        const pathname = window.location.pathname
        const segments = pathname.split('/')
        const lastSegment = segments[segments.length - 1]

        if (lastSegment === 'connexion') {
            moveSwitch()
        }
    }, [])


    useEffect(() => {
        moveSwitch()
    }, [sumbitSwitch])

    return (
        <div className="inscriptionLogin_globale_container">

            <div className="inscriptionLogin_parent_container">

                <div className="inscriptionLogin_component_container">
                    <p className="inscriptionLogin_component_sing_in">sing-in</p>
                    <UserLogin/>
                </div>

                <div className="inscriptionLogin_component_container">
                    <p className="inscriptionLogin_component_sing_up">sing-up</p>
                    <UserInscription/>
                </div>

                <div className={switchisActive ? "inscriptionLogin_switcher_blog_active" : "inscriptionLogin_switcher_blog"}></div>

                <div className={inscriptionIsActive ? "inscriptionLogin_inscription_banner_container_active" : "inscriptionLogin_inscription_banner_container"}>
                    <div className="inscriptionLogin_inscription_banner_sub_container">
                        <p className="inscriptionLogin_inscription_banner_text">Cree un compte vous permet plus de reactivité avec nous</p>
                        <button className="inscriptionLogin_inscription_switch_btn" onClick={moveSwitch}>inscription</button>
                    </div>
                </div>
                
                <div className={connexionIsActive ? "inscriptionLogin_connexion_banner_container_active" : "inscriptionLogin_connexion_banner_container"}>
                    <div className="inscriptionLogin_connexion_banner_sub_container">
                        <p className="inscriptionLogin_connexion_banner_text">Connectez vous et accedez a votre espace client</p>
                        <button className="inscriptionLogin_connexion_switch_btn" onClick={moveSwitch}>connexion</button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default InscriptionLogin;
