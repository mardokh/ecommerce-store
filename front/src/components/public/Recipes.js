import React, { useEffect, useState, useRef } from "react"
import '../../styles/components.public/recettes.css'
import { recipeService } from '../../_services/recipes.service'
import { favoriteRecipeService } from '../../_services/favoritesRecipes.service'
import { Link } from "react-router-dom"
import Cookies from 'js-cookie'
import MyContext from '../../_utils/contexts'
import { useDispatch } from 'react-redux'
import { updateFavsRecipes } from '../../redux/reducers/favRcpSlice'



const Recettes = () => {

    // STATES //
    const [recipes, setRecipes] = useState([])
    const [isLoad, setISload] = useState(false)
    const [refNotfound, setRefNotfound] = useState(false)

    
    // Redux set
    const dispatch = useDispatch()
    

    // REFERENCES //
    const flag = useRef(false)


    // Handle errors
    const handleError = (err) => {
        if (err.response && err.response.status) {
            setRefNotfound(true)
            setRecipes(err.response.data.data)
            setISload(true)
        } else {
            console.log('Error:', err.message)
        }
    }


    const getRecipes = async () => {

        try {
            // Get all recipes 
            const RecipesResponse = await recipeService.getAllRecipes()

            const recipesData = RecipesResponse.data.data

            // Get cookie from browser
            const isFavoritesCookieExists = Cookies.get('client_id_favorites_recipes')

            // If cookie exist
            if (isFavoritesCookieExists) {

                // Get all favotes recipes
                const favoritesRecipes = await favoriteRecipeService.favoriteRecipeGetAll()

                if (favoritesRecipes.data.data === "aucune recette favorite") {

                    //Update state
                    setRecipes(recipesData)

                    // Update loader 
                    setISload(true)
                }
                else {
                    // Get favorite produt id from favoritesRecipes table
                    const favoriteIds = favoritesRecipes.data.data.map(favorite => favorite.recipe_id)

                    // Update state
                    setRecipes(recipesData.map(recipe => ({
                        id: recipe.id,
                        name: recipe.name,
                        note: recipe.note,
                        image: recipe.image,
                        favorite: favoriteIds.includes(recipe.id) ? true : false
                    })))

                    // Update loader 
                    setISload(true)
                }
            }
            else {
                //Update state
                setRecipes(recipesData)

                // Update loader 
                setISload(true)
            }
        }
        catch (err) {
            handleError(err)
        }
    }


    // API CALL FOR GET RECIPES //
    useEffect(() => {

        if (flag.current === false) {
            getRecipes()
        }
        return () => flag.current = true
    }, [])


    // ADD RECIPE TO FAVORITES //
    const addTofavorite = async (recipeId, event) => {
        try {
            // Get css style of icon 
            const heartIcon = event.currentTarget
            const computedStyle = window.getComputedStyle(heartIcon)
            const color = computedStyle.color
    
            if (color === 'rgba(0, 128, 0, 0.45)') {
                
                // Api call for add favorite recipe
                const favorites_recipes_add = await favoriteRecipeService.favoriteRecipeAdd({ id: recipeId })

                // Update state context
                dispatch(updateFavsRecipes({count: favorites_recipes_add.data.data.length}))

                // Change icon color
                heartIcon.style.color = 'gold'
            } else {
                // Api call for delete favorite recipe
                await favoriteRecipeService.favoriteRecipeDelete(recipeId)

                // Api call for get all favorites recipes
                const favorites_recipes_del = await favoriteRecipeService.favoriteRecipeCount()

                // Update state context
                dispatch(updateFavsRecipes({count: favorites_recipes_del.data.data.length}))

                // Change icon color
                heartIcon.style.color = 'rgba(0, 128, 0, 0.45)'
            }
        } catch (err) {
            console.error(err)
        }
    }
    

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
         const halfStar = rating % 1 > 0
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
        return (
            <div className="recette_rating_star_container">
                {[...Array(fullStars)].map((_, index) => (
                    <svg key={index} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="recette_rating_star_enable">
                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                    </svg>
                ))}
                {halfStar && (
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" strokeWidth="1" stroke="gray">
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="#FFD700" />
                                <stop offset="50%" stopColor="white" />
                            </linearGradient>
                        </defs>
                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" fill="url(#half)" />
                    </svg>
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <svg key={index} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="recette_rating_star_disable">
                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                    </svg>
                ))}
            </div>
        )
    }
    

    // Loader //
    if (!isLoad) {
        return <div>Loading...</div>
    }


    return (
        <div className="recipe_global_container">
            <div className='recettes_tout_voir'>
                <p>Nos Recettes</p>
                <Link to="/recipes">
                    <p>Tout voir  &gt;&gt;</p>
                </Link>
            </div>
            <div className="recipes_parent_container">
                {!refNotfound ?
                recipes.map(recipe => (
                    <div key={recipe.id} className='pics_container_sub'>
                        <div className='pics_englob'>
                        <Link to={`/recette_details/${recipe.id}`}><div className='pics_container' style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${recipe.image}')`}}></div></Link>
                            <div className='info_container'>
                                <p className='recette_name'>{recipe.name.substring(0, 29)}..</p>
                                <div className="recettes_interactions">
                                    {renderStars(recipe.note)}
                                    <Link><i class={`fa-solid fa-bookmark ${recipe.favorite && 'favRecipe'}`} onClick={(e) => addTofavorite(recipe.id, e)}></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : <div className="recette_section_vide">
                        <p>{recipes}</p>
                    </div>
                }
            </div>
        </div>
    )
}


export default Recettes