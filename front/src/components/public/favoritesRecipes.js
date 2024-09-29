import React, { useEffect, useRef, useState, useContext } from "react"
import { favoriteRecipeService } from "../../_services/favoriteRecipe.service"
import "../../styles/components.public/favorites_recipes.css"
import MyContext from '../../_utils/contexts'
import CustomLoader from '../../_utils/customeLoader/customLoader'


const FavoritesRecipes = () => {

    // STATES //
    const [recipes, setRecipes] = useState([])
    const [isLoad, setISload] = useState(false)
    const { updateFavoritesRecipesCount } = useContext(MyContext)
    

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

            // Update state context
            updateFavoritesRecipesCount(favorites_recipes_del.data.data.length)

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
                            <i class="fa-solid fa-circle-xmark" id="favorites_Recipes_close_icon" onClick={() => deleteFavoriteRecipe(recipe.favorite_recipe.id)}></i>
                        </div>
                        <div className="favorites_Recipes_image" style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${recipe.favorite_recipe.image}')`}}></div>
                        <div className="favorites_Recipes_name">
                            <p>{recipe.favorite_recipe.name}</p>
                        </div>
                    </div>  
                )) : (<div>{recipes}</div>)
            }
        </div>
    )
}


export default FavoritesRecipes