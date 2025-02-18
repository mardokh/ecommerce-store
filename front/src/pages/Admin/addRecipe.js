import React, { useRef, useState } from "react"
import "../../styles/pages.admin/addRecipe.css"
import { recipeService } from '../../_services/recipes.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import {NameMaxLength, NameForbidden, IngredientsMaxLength, IngredientsForbidden,
        DirectionsMaxLength, DirectionsForbidden, MAX_FILE_SIZE, SUPPORTED_FORMATS
} from '../../_utils/regex/addEditRecipe.regex'
const AddImage = require('../../images/AddImage.jpg')


const AddRecipe = () => {

    // STATES //
    const [recipe, setRecipe] = useState({name: "", ingredients: "", directions: "", image: null})
    const [imageUrl, setImageUrl] = useState()
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)
    const [nameError, setNameError] = useState("")
    const [ingredientsError, setIngredientsError] = useState("")
    const [directionsError,setDirectionsError] = useState("")
    const [imageError, setImageError] = useState("")
    const [imageUploaded, setImageUploaded] = useState(false)


    // REFERENCES //
    const formRef = useRef()


    // SUBMIT FROM //
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
            await recipeService.createRecipe(formData)
            formRef.current.reset()
            setImageUrl("")
            setImageUploaded(false)
            setLoader(false)
            setTimeout(() => setOnLoader(false), 2000)
        }
        catch (err) {
            console.error('Error : ', err)
        }
    }


    // UPDATE INPUTS STATE //
    const handleInputChange = (name, value) => {
        setRecipe({
            ...recipe,
            [name]: value
        })
    }


    // UPDATE IMAGE STATE //
    const handleImageChange = (image) => {
        setRecipe({
            ...recipe,
            image: image
        })
        const newUrl = URL.createObjectURL(image)
        setImageUrl(newUrl)
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
                handleInputChange(name, value)
            }
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
                handleInputChange(name, value)
            }
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
                handleInputChange(name, value)
            }
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


    // MAIN RENDERING //
    return (
        <div className="add_recipe_global_container">
            {onLoader &&
                <div className='add_recipe_load_success_global_container'>
                    <div className='add_recipe_load_success_container'>
                        {loader ?
                        <div className='add_recipe_loader_spin'>
                            <CustomLoader />
                        </div>
                        :
                        <div className='add_recipe_success_container'>
                            <svg className="add_recipe_success_icon" viewBox="0 0 20 20">
							    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
						    </svg>
                            <p>recette ajouter avec succes</p>
                        </div>
                        } 
                    </div>
                </div>
            }
            <div className='add_recipe_form_global_container'>
                <div className='add_recipe_form_container'>
                    <div className='add_recipe_principale_image_container'>
                        <p>Aperçu image principale</p>
                        <div className="add_recipe_image" style={{backgroundImage: `url('${!imageUploaded ? AddImage : imageUrl}')`}}></div>
                    </div>
                    <form className='add_recipe_container' onSubmit={handleSubmit} ref={formRef}>
                        <div className='add_recipe_item'>
                            <label>Name</label>
                            <input 
                                type='text' 
                                name='name'
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            />
                            {nameError.length > 0 &&
                                <p className='add_recipe_error'>{nameError}</p>
                            }
                        </div>
                        <div className='add_recipe_item'>
                            <label>Ingredients</label>
                            <textarea 
                                name='ingredients'
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            >
                            </textarea>
                            {ingredientsError.length > 0 &&
                                <p className='add_recipe_error'>{ingredientsError}</p>
                            }
                        </div>
                        <div className='add_recipe_item'>
                            <label>Directions</label>
                            <textarea 
                                name='directions'
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            >
                            </textarea>
                            {directionsError.length > 0 &&
                                <p className='add_recipe_error'>{directionsError}</p>
                            }
                        </div>
                        <div className='add_recipe_item add_recipe_img_input'>
                            <label>image principale</label>
                            <input 
                                type='file' 
                                name='image'
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.files[0])}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.files[0])} 
                            />
                            {imageError.length > 0 &&
                                <p className='add_recipe_error'>{imageError}</p>
                            }
                        </div>
                        <div className='add_recipe_btn_container'>
                            <input type='submit' className='btn_new_recipe_add' value='ajouter'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default AddRecipe