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

            <div className="favories_back_home">
                <Link to="/home">
                    <p>acceuil</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4l8 8-8 8" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Link>
                <p>favoris</p>
            </div>

            <div className="favories_fav_products_container">
                <p className="favories_title">Mes produits favoris ({favPrdcount})</p>
                <FavoritesProducts />
            </div>

            <div className="favories_fav_recipes_container">
                <p className="favories_title">Mes recettes favorites({favRcpcount})</p>
                <FavoritesRecipes />
            </div>
            
        </div>
    )
}


export default Favorites




