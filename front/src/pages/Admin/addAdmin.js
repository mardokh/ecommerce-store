import React from "react"
import "../../styles/pages.admin/addAdmin.css"


const AddAdmin = () => {



    return (
        <form className="addAdmin_form_container">
            <div className="addAdmin_input_container">
                <input type="text" placeholder="firstName"/>
            </div>
            <div className="addAdmin_input_container">
                <input type="text" placeholder="lastName" />
            </div>
            <div className="addAdmin_input_container">
                <input type="email" placeholder="email" />
            </div>
            <div className="addAdmin_input_container">
                <input type="password" placeholder="password"/>
            </div>
            <div className="addAdmin_input_container">
                <input className="addAdmin_submit_btn" type="submit" value="confirmer"/>
            </div>
        </form>
    )
}


export default AddAdmin