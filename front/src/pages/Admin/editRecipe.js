import React, {useEffect, useState, useRef } from "react"
import "../../styles/pages.admin/editRecipe.css"
import { recipeService } from "../../_services/recipes.service"
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useParams } from "react-router-dom"
import {NameMaxLength, NameForbidden, IngredientsMaxLength, IngredientsForbidden,
    DirectionsMaxLength, DirectionsForbidden, MAX_FILE_SIZE, SUPPORTED_FORMATS
} from '../../_utils/regex/addEditRecipe.regex'


const EditRecipe = () => {

    // STATES //
    const [recipe, setRecipe] = useState({id: null, name: "", ingredients: "", directions: "", image: null})
    const [imageUrl, setImageUrl] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)
    const [nameError, setNameError] = useState("")
    const [ingredientsError, setIngredientsError] = useState("")
    const [directionsError,setDirectionsError] = useState("")
    const [imageError, setImageError] = useState("")
    const [imageUploaded, setImageUploaded] = useState(false)
   

    // GET ID PARAMS
    const {id} = useParams()


    // API CALL FOR GET RECIPE //
    useEffect(() => {
        recipeService.getOneRecipe(id)
            .then(res => {
                setRecipe({
                    id: res.data.data.id,
                    name: res.data.data.name,
                    ingredients: res.data.data.ingredients,
                    directions: res.data.data.directions,
                    image: res.data.data.image
                })
                setIsLoading(true)
        })
        .catch(err => console.error('Error : ', err))
    }, [])


    // FORM SUBMIT //
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!recipe.name || !recipe.ingredients || !recipe.directions || !recipe.image) {
            if (!recipe.name) setNameError("Le nom de la recette est requis");
            if (!recipe.ingredients) setIngredientsError("Les ingredients de la recette sont requis");
            if (!recipe.directions) setDirectionsError("Les directions de recette sont est requises");
            if (!recipe.image) setImageError("Une image principale est requise");
            return;
        }
        try {
            setOnLoader(true)
            setLoader(true)
            const formData = new FormData()
            formData.append('name', recipe.name)
            formData.append('ingredients', recipe.ingredients)
            formData.append('directions', recipe.directions)
            formData.append('image', recipe.image)
            formData.append('id', id)
            await recipeService.updateRecipe(formData)
            setImageUploaded(false)
            setLoader(false)
            setTimeout(() => setOnLoader(false), 2000)
        }
        catch (err) {
            if (err.response?.status === 400) {
                err.response.data.errors.map(({field, message}) => {
                    if (field === 'name') {
                        setNameError(message)
                    } else if (field === 'ingredients') {
                        setIngredientsError(message)
                    } else if (field === 'directions') {
                        setDirectionsError(message)
                    } else if (field === 'image') {
                        setImageError(message)
                    }
                })
            }
            console.error('Error: ', err)
        }
    }

    
    // UPDATE INPUTS STATE //
    const handleInputChange = (name, value) => {
        setRecipe({
            ...recipe,
            [name]: value
        })
    }


    // INSERT IMAGE //
    const handleImageChange = (image) => {
        setRecipe({
            ...recipe,
            image: image
        })
        const urlImage = URL.createObjectURL(image)
        setImageUrl(urlImage)
        setImageUploaded(true)
    }

    
    // INPUTS ERRORS HANDLER //
    const handleFieldsErrors = (name, value) => {
        if (name === 'name') {
            if (!value) {
                setNameError("Le nom de la recette est requis")
            } else if (!NameMaxLength.test(value)) {
                setNameError("Le nom de la recette ne doit pas dépasser 100 caractères")
            } else if (!NameForbidden.test(value)) {
                setNameError("Le nom de la recette contient des caractères invalides")
            } else {
                setNameError("")
            }
            handleInputChange(name, value)
        }
        if (name === 'ingredients') {
            if (!value) {
                setIngredientsError("Les ingredients de la recette sont requis")
            } else if (!IngredientsMaxLength.test(value)) {
                setIngredientsError("Les ingredients de la recette ne doivent pas dépasse 800 caractères")
            } else if (!IngredientsForbidden.test(value)) {
                setIngredientsError("Les ingredients de la recette contiennent des caractères invalides")
            } else {
                setIngredientsError("")
            }
            handleInputChange(name, value)
        }
        if (name === 'directions') {
            if (!value) {
                setDirectionsError("Les directions de recette sont est requises")
            } else if (!DirectionsMaxLength.test(value)) {
                setDirectionsError("Les directions de recette ne doivent pas dépasse 800 caractères")
            } else if (!DirectionsForbidden.test(value)) {
                setDirectionsError("Les directions de recette contiennent des caractères invalides")
            } else {
                setDirectionsError("")
            }
            handleInputChange(name, value)
        }
        if (name === 'image') {
            if (!value)  {
                setImageError("Une image principale est requise")
            } else if (!SUPPORTED_FORMATS.includes(value.type)) {
                setImageError("Format invalide, (png, jpg, jpeg) seulement")
            } else if (value.size > MAX_FILE_SIZE) {
                setImageError("Votre image ne doit pas depassé 2MB")
            } else {
                setImageError("")
                handleImageChange(value)
            }
        }
    }


    // LOADING HANDLER
    if (!isLoading) {
        return <CustomLoader/>
    }


    return ( 
        <div className="edit_recipe_global_container">  
            {onLoader &&
                <div className='edit_recipe_load_success_global_container'>
                    <div className='edit_recipe_load_success_container'>
                        {loader ?
                        <div className='edit_recipe_loader_spin'>
                            <CustomLoader />
                        </div>
                        :
                        <div className='edit_recipe_success_container'>
                            <svg className="edit_recipe_success_icon" viewBox="0 0 20 20">
							    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
						    </svg>
                            <p>Modification effecuter avec succe</p>
                        </div>
                        } 
                    </div>
                </div>
            }
            <div className='edit_recipe_form_global_container'>
                <div className='edit_recipe_form_container'>
                    <div className='edit_recipe_principale_image_container'>
                        <p>Aperçu image principale</p>
                        <div className="edit_recipe_image" style={{backgroundImage: `url('${!imageUploaded ? `${process.env.REACT_APP_SERVER_HOST}/uploads/${recipe.image}` : imageUrl}')`}}></div>
                    </div>
                    <form className='edit_recipe_container' onSubmit={handleSubmit}>
                        <div className='edit_recipe_item'>
                            <label>Name</label>
                            <input 
                                type='text' 
                                name='name' 
                                value={recipe.name} 
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            />
                            {nameError.length > 0 &&
                                <p className='edit_recipe_error'>{nameError}</p>
                            }
                        </div>
                        <div className='edit_recipe_item'>
                            <label>Ingredients</label>
                            <textarea 
                                name='ingredients' 
                                value={recipe.ingredients} 
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            >
                            </textarea>
                            {ingredientsError.length > 0 &&
                                <p className='edit_recipe_error'>{ingredientsError}</p>
                            }
                        </div>
                        <div className='edit_recipe_item'>
                            <label>Directions</label>
                            <textarea 
                                name='directions' 
                                value={recipe.directions} 
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                >
                            </textarea>
                            {directionsError.length > 0 &&
                                <p className='edit_recipe_error'>{directionsError}</p>
                            }
                        </div>
                        <div className='edit_recipe_item edit_recipe_img_input'>
                            <label>image principale</label>
                            <input 
                                type='file' 
                                name='image'
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.files[0])}
                            />
                            {imageError.length > 0 &&
                                <p className='edit_recipe_error'>{imageError}</p>
                            }
                        </div>
                        <div className='edit_recipe_btn_container'>
                            <input type='submit' className='btn_new_recipe_edit' value='ajouter'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default EditRecipe