import React, { useEffect, useRef, useState, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { recipeService } from "../../_services/recipes.service"
import "../../styles/pages.public/recipe_details.css"
import RecipesReviews from "../../components/public/RecipesReviews"
import CustomLoader from '../../_utils/customeLoader/customLoader'
import MyContext from "../../_utils/contexts"



const RecipeDetails = () => {

    // STATES //
    const [recipe, setRecipe] = useState()
    const [isLoad, setISload] = useState()


    // CONTEXTS //
    const { updateRecipeReviewsOnDisplay } = useContext(MyContext)
    const { userHaveRecipeComment } = useContext(MyContext)


    // GET ID PARAMS //
    const {id} = useParams()
    

    // REFERENCE //
    const flag = useRef(false)


    // API CALL FOR GET RECIPE //
    useEffect(() => {
        if (flag.current === false) {
            recipeService.getOneRecipe(id)
                .then(res => {
                    setRecipe(res.data.data)
                    setISload(true)
                })
                .catch(err => console.error('Error : ', err))
        }
        return () => flag.current = true
    }, [])


    // REVIWES FORM HANDLER //
    const dispRviewsForm = () => {
        updateRecipeReviewsOnDisplay(true)
    }


    // LOADING //
    if (!isLoad) {
        return <CustomLoader/>
    }


    return (
        <div className="details_recipe_global_container">

            <div className="details_recipe_back_home">
                <Link to="/home">
                    <p>home</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4l8 8-8 8" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Link>
                <Link to="/products">
                    <p>products</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4l8 8-8 8" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Link>
                <p>details</p>
            </div>
            
            <section className="details_recipe_parent_container">
            <div className="details_recipe_img_container" style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${recipe.image}')`}}></div>
                <div className="details_recipe_info_container">
                    <p className="recipe_details_name">{recipe.name}</p>
                    <div className="details_recipe_info_sub_container">
                        <div>
                            <div className="recipe_details_info_time_container">
                                <div className="recipe_details_info_time_item">
                                    <svg className="reipe_time_cooking_svg_icon" viewBox="0 0 20 20" strokeWidth="0.5px" stroke="lightseagreen">
                                        <path fill="none" d="M11.088,2.542c0.063-0.146,0.103-0.306,0.103-0.476c0-0.657-0.534-1.19-1.19-1.19c-0.657,0-1.19,0.533-1.19,1.19c0,0.17,0.038,0.33,0.102,0.476c-4.085,0.535-7.243,4.021-7.243,8.252c0,4.601,3.73,8.332,8.332,8.332c4.601,0,8.331-3.73,8.331-8.332C18.331,6.562,15.173,3.076,11.088,2.542z M10,1.669c0.219,0,0.396,0.177,0.396,0.396S10.219,2.462,10,2.462c-0.22,0-0.397-0.177-0.397-0.396S9.78,1.669,10,1.669z M10,18.332c-4.163,0-7.538-3.375-7.538-7.539c0-4.163,3.375-7.538,7.538-7.538c4.162,0,7.538,3.375,7.538,7.538C17.538,14.957,14.162,18.332,10,18.332z M10.386,9.26c0.002-0.018,0.011-0.034,0.011-0.053V5.24c0-0.219-0.177-0.396-0.396-0.396c-0.22,0-0.397,0.177-0.397,0.396v3.967c0,0.019,0.008,0.035,0.011,0.053c-0.689,0.173-1.201,0.792-1.201,1.534c0,0.324,0.098,0.625,0.264,0.875c-0.079,0.014-0.155,0.043-0.216,0.104l-2.244,2.244c-0.155,0.154-0.155,0.406,0,0.561s0.406,0.154,0.561,0l2.244-2.242c0.061-0.062,0.091-0.139,0.104-0.217c0.251,0.166,0.551,0.264,0.875,0.264c0.876,0,1.587-0.711,1.587-1.587C11.587,10.052,11.075,9.433,10.386,9.26z M10,11.586c-0.438,0-0.793-0.354-0.793-0.792c0-0.438,0.355-0.792,0.793-0.792c0.438,0,0.793,0.355,0.793,0.792C10.793,11.232,10.438,11.586,10,11.586z"></path>
                                    </svg>
                                    <div className="recipe_details_sub_info_time_item">
                                        <p>temps Preparation :</p>
                                        <p>20 min</p>
                                    </div>
                                </div>
                                <div className="recipe_details_info_time_item">
                                    <svg className="reipe_time_svg_icon" viewBox="0 0 20 20" strokeWidth="0.2px" stroke="lightseagreen">
                                        <path fill="none" d="M4.68,13.716v-0.169H4.554C4.592,13.605,4.639,13.658,4.68,13.716z M11.931,6.465
                                        c-0.307-0.087-0.623,0.106-0.706,0.432l-1.389,5.484c-0.901,0.084-1.609,0.833-1.609,1.757c0,0.979,0.793,1.773,1.773,1.773
                                        c0.979,0,1.773-0.794,1.773-1.773c0-0.624-0.324-1.171-0.812-1.486l1.377-5.439C12.422,6.887,12.239,6.552,11.931,6.465z
                                        M10.591,14.729H9.408v-1.182h1.183V14.729z M15.32,13.716c0.04-0.058,0.087-0.11,0.126-0.169H15.32V13.716z M10,3.497
                                        c-3.592,0-6.503,2.911-6.503,6.503H4.68c0-2.938,2.382-5.32,5.32-5.32s5.32,2.382,5.32,5.32h1.182
                                        C16.502,6.408,13.591,3.497,10,3.497z M10,0.542c-5.224,0-9.458,4.234-9.458,9.458c0,5.224,4.234,9.458,9.458,9.458
                                        c5.224,0,9.458-4.234,9.458-9.458C19.458,4.776,15.224,0.542,10,0.542z M15.32,16.335v0.167h-0.212
                                        c-1.407,1.107-3.179,1.773-5.108,1.773c-1.93,0-3.701-0.666-5.108-1.773H4.68v-0.167C2.874,14.816,1.724,12.543,1.724,10
                                        c0-4.571,3.706-8.276,8.276-8.276c4.57,0,8.275,3.706,8.275,8.276C18.275,12.543,17.126,14.816,15.32,16.335z"></path>
                                    </svg>
                                    <div className="recipe_details_sub_info_time_item">
                                        <p>temps Cuissant :</p>
                                        <p>30 min</p>
                                    </div>
                                </div>
                                <div className="recipe_details_info_time_item">
                                    <svg className="reipe_time_total_svg_icon" viewBox="0 0 20 20" strokeWidth="0.5px" stroke="lightseagreen">
                                        <path d="M10.25,2.375c-4.212,0-7.625,3.413-7.625,7.625s3.413,7.625,7.625,7.625s7.625-3.413,7.625-7.625S14.462,2.375,10.25,2.375M10.651,16.811v-0.403c0-0.221-0.181-0.401-0.401-0.401s-0.401,0.181-0.401,0.401v0.403c-3.443-0.201-6.208-2.966-6.409-6.409h0.404c0.22,0,0.401-0.181,0.401-0.401S4.063,9.599,3.843,9.599H3.439C3.64,6.155,6.405,3.391,9.849,3.19v0.403c0,0.22,0.181,0.401,0.401,0.401s0.401-0.181,0.401-0.401V3.19c3.443,0.201,6.208,2.965,6.409,6.409h-0.404c-0.22,0-0.4,0.181-0.4,0.401s0.181,0.401,0.4,0.401h0.404C16.859,13.845,14.095,16.609,10.651,16.811 M12.662,12.412c-0.156,0.156-0.409,0.159-0.568,0l-2.127-2.129C9.986,10.302,9.849,10.192,9.849,10V5.184c0-0.221,0.181-0.401,0.401-0.401s0.401,0.181,0.401,0.401v4.651l2.011,2.008C12.818,12.001,12.818,12.256,12.662,12.412"></path>
                                    </svg>
                                    <div className="recipe_details_sub_info_time_item">
                                        <p>temps Total :</p>
                                        <p>50 min</p>
                                    </div>
                                </div>
                            </div>
                            <div style={{display: "flex", justifyContent: "space-between", width:"100%", padding: "10px", marginTop: "40px"}}>
                                    <div style={{display: "flex"}}>
                                        {[...Array(5)].map((_, index) => (
                                            <svg
                                                key={index}
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="details_product_rating_star_enable_posted"
                                            >
                                                <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p style={{fontSize:"15px"}}>(4.5) 211 avis</p>
                            </div>
                        </div>
                        <div className="details_recipe_shopping_add_btn">
                            <p>Ajouter au favories</p>
                            <svg className="svg-icon-recipe_details" viewBox="0 0 20 20">
                                <path d="M14.467,1.771H5.533c-0.258,0-0.47,0.211-0.47,0.47v15.516c0,0.414,0.504,0.634,0.802,0.331L10,13.955l4.136,4.133c0.241,0.241,0.802,0.169,0.802-0.331V2.241C14.938,1.982,14.726,1.771,14.467,1.771 M13.997,16.621l-3.665-3.662c-0.186-0.186-0.479-0.186-0.664,0l-3.666,3.662V2.711h7.994V16.621z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </section>
            <div className="details_line_between_recipes_comments"></div>
            <div className="details_recipe_comments_write_reviews_button_global_container">
                <div className="details_recipe_comments_write_reviews_button_parent_container">
                    <h1 className="details_recipe_comments_title">details de la recette</h1>
                </div>
            </div>
            <section className="details_recipe_details_global_container">
                <div className="details_recipe_details_container">
                    <h1>Ingrediens</h1>
                    <p>
                        {recipe.ingredients}
                    </p>
                </div>
                <div className="details_recipe_details_container">
                    <h1>Methode</h1>
                    <p>
                        {recipe.directions}
                    </p>
                </div>
            </section>
            <div className="details_line_between_recipes_comments"></div>
            <div className="details_recipe_comments_write_reviews_button_global_container">
                <div className="details_recipe_comments_write_reviews_button_parent_container">
                    <h1 className="details_recipe_comments_title">commentaires & notes</h1>
                    {!userHaveRecipeComment &&
                        <button className="details_write_reviews_btn" onClick={dispRviewsForm}>laisser un avis & une note</button>
                    }
                </div>
            </div>
            {<RecipesReviews recipeId={id}/>}
        </div>
    )
}


export default RecipeDetails