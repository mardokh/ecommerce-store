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

            {favPrdcount === 0 && favRcpcount === 0 &&
                <div className="favories_no_favorites_container">
                    <p>Aucun favoris n'a été ajouter a votre liste</p>
                    <svg className="svg-icon-no-favorites" viewBox="0 0 20 20">
						<path fill="none" d="M16.85,7.275l-3.967-0.577l-1.773-3.593c-0.208-0.423-0.639-0.69-1.11-0.69s-0.902,0.267-1.11,0.69L7.116,6.699L3.148,7.275c-0.466,0.068-0.854,0.394-1,0.842c-0.145,0.448-0.023,0.941,0.314,1.27l2.871,2.799l-0.677,3.951c-0.08,0.464,0.112,0.934,0.493,1.211c0.217,0.156,0.472,0.236,0.728,0.236c0.197,0,0.396-0.048,0.577-0.143l3.547-1.864l3.548,1.864c0.18,0.095,0.381,0.143,0.576,0.143c0.256,0,0.512-0.08,0.729-0.236c0.381-0.277,0.572-0.747,0.492-1.211l-0.678-3.951l2.871-2.799c0.338-0.329,0.459-0.821,0.314-1.27C17.705,7.669,17.316,7.343,16.85,7.275z M13.336,11.754l0.787,4.591l-4.124-2.167l-4.124,2.167l0.788-4.591L3.326,8.5l4.612-0.67l2.062-4.177l2.062,4.177l4.613,0.67L13.336,11.754z"></path>
					</svg>
                </div>
            }

            {favPrdcount > 0 &&
                <div className="favories_fav_products_container">
                    <p className="favories_title">Mes produits favoris ({favPrdcount})</p>
                    <FavoritesProducts />
                </div>
            }

            {favRcpcount > 0 &&
                <div className="favories_fav_recipes_container">
                    <p className="favories_title">Mes recettes favorites({favRcpcount})</p>
                    <FavoritesRecipes />
                </div>
            }
            
        </div>
    )
}


export default Favorites




