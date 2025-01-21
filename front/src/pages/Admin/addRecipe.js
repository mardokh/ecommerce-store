import React, { useRef, useState } from "react"
import "../../styles/pages.admin/addRecipe.css"
import { recipeService } from '../../_services/recipes.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
const AddImage = require('../../images/AddImage.jpg')


const AddRecipe = () => {

    // STATES //
    const [recipe, setRecipe] = useState({name: "", ingredients: "", directions: "", image: ""})
    const [imageUrl, setImageUrl] = useState()
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)


    // REFERENCE //
    const imageFlag = useRef(false)


    // SUBMIT FROM //
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            //Load data
            setOnLoader(true)
            setLoader(true)

            const formData = new FormData()
            formData.append('name', recipe.name)
            formData.append('ingredients', recipe.ingredients)
            formData.append('directions', recipe.directions)
            formData.append('image', recipe.image)

            // Api call for add recipe
            await recipeService.createRecipe(formData)

            setRecipe({name: "", ingredients: "", directions: "", image: ""})

            setImageUrl("")

            imageFlag.current = false

            // Update loader
            setLoader(false)
    
            // Close windows
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

        if (image) {
            const urlImage = URL.createObjectURL(image)
            setImageUrl(urlImage)
            imageFlag.current = true
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
                        <div className="add_recipe_image" style={{backgroundImage: `url('${!imageFlag.current ? AddImage : imageUrl}')`}}></div>
                    </div>
                    <div className='add_recipe_container'>
                        <div className='add_recipe_item'>
                            <label>Name</label>
                            <input type='text' name='name' value={recipe.name} onChange={(e) => handleInputChange(e.target.name, e.target.value)}/>
                        </div>
                        <div className='add_recipe_item'>
                            <label>Ingredients</label>
                            <textarea name='ingredients' value={recipe.ingredients} onChange={(e) => handleInputChange(e.target.name, e.target.value)}></textarea>
                        </div>
                        <div className='add_recipe_item'>
                            <label>Directions</label>
                            <textarea name='directions' value={recipe.directions} onChange={(e) => handleInputChange(e.target.name, e.target.value)}></textarea>
                        </div>
                        <div className='add_recipe_item add_recipe_img_input'>
                            <label>image principale</label>
                            <input type='file' name='image' onChange={(e) => handleImageChange(e.target.files[0])} />
                        </div>
                    </div>
                </div>
                <div className='add_recipe_btn_container'>
                    <button className='btn_new_recipe_add' onClick={handleSubmit}>ajouter</button>
                </div>
            </div>
        </div>
        
    )
}

export default AddRecipe