import React, { useEffect, useRef, useState } from "react"
import { favoriteRecipeService } from "../../_services/favoritesRecipes.service"
import "../../styles/components.public/favorites_recipes.css"
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useDispatch } from 'react-redux'
import { updateFavsRecipes } from '../../redux/reducers/favRcpSlice'


const FavoritesRecipes = () => {

    // STATES //
    const [recipes, setRecipes] = useState([])
    const [isLoad, setISload] = useState(false)

    const dispatch = useDispatch()
    

    // REFERENCE //
    const refUseEffect = useRef(false)
    const refRecipes = useRef(false)


    // GET ALL RECIPES ADDS IN FAVORITES
    useEffect(() => {
        if (refUseEffect.current === false) {
            favoriteRecipeService.favoriteRecipeGetAll()
            .then(res => {
                if (res.data.data && res.data.data[0] && res.data.data[0].favorite_recipe) {      
                    refRecipes.current = true
                }
                setRecipes(res.data.data)
                setISload(true)
            })
            .catch(err => console.error(err))
        }
        return () => refUseEffect.current = true
    }, [])


    // DELETE FAVORITE //
    const deleteFavoriteRecipe = async (recipeId) => {

        try {
            // Api call for delete favorite recipe
            await favoriteRecipeService.favoriteRecipeDelete(recipeId)

            // Api call for get all favorites recipes
            const favorites_recipes_del = await favoriteRecipeService.favoriteRecipeCount()

            // Update favorites count
            dispatch(updateFavsRecipes({count: favorites_recipes_del.data.data.length}))

            // APi call for get favorites recipes
            const favoriteRecipe = await favoriteRecipeService.favoriteRecipeGetAll()

            // Update state
            setRecipes(favoriteRecipe.data.data)

            if (favoriteRecipe.data.data && favoriteRecipe.data.data[0] && !favoriteRecipe.data.data[0].favorite_recipe) {      
                refRecipes.current = false
            }
        }
        catch (err) {
            console.error(err)
        }
    }


    // Loader //
    if (!isLoad) {
        return <CustomLoader/>
    }


    return (
        <div className="favorites_Recipes_main_container">
            {refRecipes.current ?
                recipes.map(recipe => (
                    <div key={recipe.favorite_recipe.id} className="favorites_Recipes_container">
                        <div className="favorites_Recipes_close_icon_container">
                            <svg className="favorites_Recipes_svg_icon favorites_Products_svg_icon_fav" viewBox="0 0 20 20">
							    <path fill="none" d="M13.22,2.984c-1.125,0-2.504,0.377-3.53,1.182C8.756,3.441,7.502,2.984,6.28,2.984c-2.6,0-4.714,2.116-4.714,4.716c0,0.32,0.032,0.644,0.098,0.96c0.799,4.202,6.781,7.792,7.46,8.188c0.193,0.111,0.41,0.168,0.627,0.168c0.187,0,0.376-0.041,0.55-0.127c0.011-0.006,1.349-0.689,2.91-1.865c0.021-0.016,0.043-0.031,0.061-0.043c0.021-0.016,0.045-0.033,0.064-0.053c3.012-2.309,4.6-4.805,4.6-7.229C17.935,5.1,15.819,2.984,13.22,2.984z M12.544,13.966c-0.004,0.004-0.018,0.014-0.021,0.018s-0.018,0.012-0.023,0.016c-1.423,1.076-2.674,1.734-2.749,1.771c0,0-6.146-3.576-6.866-7.363C2.837,8.178,2.811,7.942,2.811,7.7c0-1.917,1.554-3.47,3.469-3.47c1.302,0,2.836,0.736,3.431,1.794c0.577-1.121,2.161-1.794,3.509-1.794c1.914,0,3.469,1.553,3.469,3.47C16.688,10.249,14.474,12.495,12.544,13.966z"></path>
						    </svg>
                            <svg className="favorites_Recipes_svg_icon" onClick={() => deleteFavoriteRecipe(recipe.favorite_recipe.id)} viewBox="0 0 20 20">
							    <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
						    </svg>
                        </div>
                        <div className="favorites_Recipes_image" style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${recipe.favorite_recipe.image}')`}}></div>
                        <div className="favorites_Recipes_name">
                            <p>{recipe.favorite_recipe.name}</p>
                        </div>
                    </div>  
                )) : (
                        <div className="favorites_Recipes_no_reveiws_container">
                            <svg class="svg-icon" viewBox="0 0 20 20">
							    <path fill="none" d="M16.85,7.275l-3.967-0.577l-1.773-3.593c-0.208-0.423-0.639-0.69-1.11-0.69s-0.902,0.267-1.11,0.69L7.116,6.699L3.148,7.275c-0.466,0.068-0.854,0.394-1,0.842c-0.145,0.448-0.023,0.941,0.314,1.27l2.871,2.799l-0.677,3.951c-0.08,0.464,0.112,0.934,0.493,1.211c0.217,0.156,0.472,0.236,0.728,0.236c0.197,0,0.396-0.048,0.577-0.143l3.547-1.864l3.548,1.864c0.18,0.095,0.381,0.143,0.576,0.143c0.256,0,0.512-0.08,0.729-0.236c0.381-0.277,0.572-0.747,0.492-1.211l-0.678-3.951l2.871-2.799c0.338-0.329,0.459-0.821,0.314-1.27C17.705,7.669,17.316,7.343,16.85,7.275z M13.336,11.754l0.787,4.591l-4.124-2.167l-4.124,2.167l0.788-4.591L3.326,8.5l4.612-0.67l2.062-4.177l2.062,4.177l4.613,0.67L13.336,11.754z"></path>
						    </svg>
                            {recipes}
                        </div>
                    )
            }
        </div>
    )
}


export default FavoritesRecipes