import React, { useState, useEffect, useRef } from "react"
import "../../styles/components.admin/header.css"
import { useNavigate } from "react-router-dom"
import { AdminService } from "../../_services/admin.service"
const mario = require("../../images/homewallpaper.jpg")


const Header = () => {
    
    const [showSetList, setShowSetList] = useState(false)
    const navigate = useNavigate()
    const settingRef = useRef(null)


    const showSettingList = () => {
        setShowSetList(!showSetList)
    }


    const logout = () => {
        AdminService.logout()
        navigate("/auth/admin")
    }


    const handleClickOutside = (event) => {
        if (settingRef.current && !settingRef.current.contains(event.target)) {
        setShowSetList(false)
        }
    }


    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
        document.removeEventListener("click", handleClickOutside);
        }
    }, [])


    return (
        <div>
            <div className="admin_searchBar_container">
                <div className="admin_searchBar_administrator_container">
                <div className="admin_searchBar_input_container">
                    <i className="fa-solid fa-magnifying-glass" id="glasses_admin"></i>
                    <input className="admin_searchBar" type="text" placeholder="search"/>
                </div>
                <div className="admin_administrator_seting_container" ref={settingRef}>
                    <div className="admin_administrator_seting_img" style={{ backgroundImage: `url(${mario})`, backgroundSize: "cover" }}></div>
                    <p>Bey Abdelnnour</p>
                    <i className="fa-solid fa-caret-down" id="admin_caret_down" onClick={showSettingList}></i>
                    <div className={showSetList ? "show_seting_list" : "hidden_seting_list"}>
                    <div onClick={logout} className="set_lougout">
                        <i className="fa-solid fa-right-from-bracket"></i>
                        <p>logout</p>
                    </div>
                    <div className="setting">
                        <i className="fa-solid fa-gear"></i>
                        <p>setting</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Header;