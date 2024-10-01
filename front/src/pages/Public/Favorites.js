import React from "react"
import { Link } from "react-router-dom"
import FavoritesProducts from "../../components/public/FavoritesProducts"
import FavoritesRecipes from "../../components/public/favoritesRecipes"
import "../../styles/pages.public/favorites.css"
import { useSelector } from 'react-redux';


const Favorites = () => {

    // REDUX //
    const favPrdcount = useSelector((state) => state.favPrdCount.count)
    const favRcpcount = useSelector((state) => state.favRcpCount.count)
   

    return (
        <div className="favories_global_container">
            <div className="favories_fav_products_container">
                <p className="favories_title">Mes produits favoris ({favPrdcount})</p>
                <FavoritesProducts />
            </div>
            <div className="favories_fav_recipes_container">
                <p className="favories_title">Mes recettes favorites({favRcpcount})</p>
                <FavoritesRecipes />
            </div>
            <Link to="/home">
                <div className="favories_back_home">
                    <svg className="favories_back_menu_svg-icon" viewBox="0 0 20 20">
                        <path fill="none" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
                        L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
                        c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
                        c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
                        S18.707,9.212,18.271,9.212z"></path>
                    </svg>
                    <p>retourner a la page d'acceuil</p>
                </div>
            </Link>
        </div>
    )
}


export default Favorites




