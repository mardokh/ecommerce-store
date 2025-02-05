import React, { useEffect, useState, useRef } from "react"
import '../../styles/components.public/recettes.css'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { recipeService } from '../../_services/recipes.service'
import { favoriteRecipeService } from '../../_services/favoritesRecipes.service'
import { Link } from "react-router-dom"
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { updateFavsRecipes } from '../../redux/reducers/favRcpSlice'
import FavoritesConcur from '../../_utils/raceConcurrency/favorites.concur'


const Recettes = () => {

    // STATES //
    const [recipes, setRecipes] = useState([])
    const [isLoad, setISload] = useState(false)
    const [notfound, setNotFound] = useState(false)
    const [raceConcur, setRaceConcur] = useState(false)
    const [exist, setExist] = useState(false)
    const [deleted, setDeleted] = useState(false)

    
    // REDUX //
    const dispatch = useDispatch()
    const favRcpCount = useSelector((state) => state.favRcpCount.count)


    // GET RECIPES
    const getRecipes = async () => {

        try {
            // Get recipes 
            const recipes = await recipeService.getAllRecipes()

            // Set favorite id
            let favId = false

            // Get cookie from browser
            const favoritesCookie = Cookies.get('client_id_favorites_recipes')

            // If cookie exist get favorites
            if (favoritesCookie) {
                try {
                    // Get favorites
                    const favorites = await favoriteRecipeService.favoriteRecipeGetAll()

                    // Filter favorite ids
                    favId = favorites.data.data.map(favorite => favorite.recipe_id)
                }
                catch (err) {
                    // Check error response
                    if (err.response && err.response.status === 404) {
                        favId = false
                    } 
                    else {
                        console.error(err)
                    }
                }
            }

            // Update state
            setRecipes(recipes.data.data.map(recipe => ({
                id: recipe.id,
                name: recipe.name,
                note: recipe.note,
                image: recipe.image,
                favorite: !favId ? false : favId.includes(recipe.id)
            })))

            // Update loader 
            setISload(true)
        }
        catch (err) {
            if (err.response && err.response.status === 404) {
                setRecipes(err.response.data.message)
                setNotFound(true)
                setISload(true)
            } 
            else {
                console.error(err)
            }
        }
    }


    // GET RECIPES ON LOAD //
    useEffect(() => {
        getRecipes()
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
                await favoriteRecipeService.favoriteRecipeCreate({ id: recipeId })

                // Update state context
                dispatch(updateFavsRecipes({count: favRcpCount + 1}))

                // Change icon color
                heartIcon.style.color = 'gold'
            } 
            else {
                // Api call for delete favorite recipe
                await favoriteRecipeService.favoriteRecipeDelete(recipeId)

                // Update state context
                dispatch(updateFavsRecipes({count: favRcpCount - 1}))

                // Change icon color
                heartIcon.style.color = 'rgba(0, 128, 0, 0.45)'
            }
        } catch (err) {
            if (err.response?.status === 409) {
                setRaceConcur(true)
                setExist(true)
            }
            else if (err.response?.status === 404) {
                setRaceConcur(true)
                setDeleted(true)
            }
            else {
                console.error(err)
            }
        }
    }

    // Reviews starry calculating
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
        return <CustomLoader />
    }


    return (
        <div className="recipe_global_container">
            {raceConcur &&
                <FavoritesConcur exist={exist} deleted={deleted}/>
            }
            <div className="recipes_parent_container">
                {!notfound ?
                recipes.map(recipe => (
                    <div key={recipe.id} className='pics_container_sub'>
                        <div className='pics_englob'>
                        <Link to={`/recette_details/${recipe.id}`}><div className='pics_container' style={{backgroundImage: `url('${process.env.REACT_APP_SERVER_HOST}/uploads/${recipe.image}')`}}></div></Link>
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