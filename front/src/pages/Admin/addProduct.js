// MODULES IMPORTS //
import React, {useState, useRef, useEffect, memo} from 'react'
import '../../styles/pages.admin/addProduct.css'
import { productService } from '../../_services/product.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
const AddImage = require('../../images/AddImage.jpg')


const ImagesDisplay = memo(({ images, imageRef, deleteImage, product }) => (
    <div className="add_product_image_container" ref={imageRef}>
        {product.images.length > 0 && (
            images.map((image, index) => (
                <div className="add_product_images_container" key={index}>
                    <i className="fa-solid fa-circle-xmark" id='add_product_images_close_icon' onClick={() => deleteImage(index)}></i>
                    <div className="add_product_images" style={{backgroundImage: `url('${URL.createObjectURL(image)}')`}}></div>
                </div>
            ))
        )}
    </div>
), (prevProps, nextProps) => {
    // Comparaison des props pour déterminer si le composant doit être mis à jour
    return prevProps.images === nextProps.images;
});


// MAIN FUNCTION
const AddProduct = () => {

    // STATES //
    const [product, setProduct] = useState({name: "", price: "", details: "", image: "", images: []})
    const [imageUrl, setImageUrl] = useState()
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)


    // REFERENCES //
    const imageFlag = useRef(false)
    const imagesDisplayContainerRef = useRef()
    const priceInputRef = useRef()


    // IMAGES CONTAINER SCROLL //
    const scrollToRightEnd = () => {
        if (imagesDisplayContainerRef.current) {
            imagesDisplayContainerRef.current.scrollTo({left: imagesDisplayContainerRef.current.scrollWidth, behavior: 'smooth'})
        }
    }

    useEffect(() => {
        scrollToRightEnd()
    }, [product])

    // Disable scroll behavior on price input field
    useEffect(() => {
        const handleWheel = (e) => {
            e.preventDefault();
        };
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault();
            }
        };

        const priceInput = priceInputRef.current;
        priceInput.addEventListener('wheel', handleWheel);
        priceInput.addEventListener('keydown', handleKeyDown);

        return () => {
            priceInput.removeEventListener('wheel', handleWheel);
            priceInput.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    
    
    // FORM SUBMIT //
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            // Load data
            setOnLoader(true)
            setLoader(true)
    
            const formData = new FormData()
            formData.append('name', product.name)
            formData.append('price', product.price)
            formData.append('details', product.details)
            formData.append('image', product.image)
            for (const file of product.images) {
                formData.append('images', file)
            }
    
            // Api call for add product
            await productService.addProduct(formData)
    
            setProduct({ name: "", price: "", details: "", image: "", images: [] })

            setImageUrl("")

            imageFlag.current = false
    
            // Update loader
            setLoader(false)
    
            // Close windows
            setTimeout(() => setOnLoader(false), 2000)

        }
        catch (error) {
            console.error('Error : ', error)
        }
    }
    

    // UPDATE INPUTS STATE //
    const handleInputChange = (name, value) => {
        setProduct({
            ...product,
            [name]: value
        })
    }

    // UPDATE IMAGE STATE //
    const handleImageChange = (image) => {
        
        setProduct({
            ...product,
            image: image
        })

        if (image) {
            const urlImage = URL.createObjectURL(image)
            setImageUrl(urlImage)
            imageFlag.current = true
        }
    }


    // UPDATE IMAGES STATE //
    const handleImagesChange = (e) => {
        const newImages = Array.from(e.target.files).map(image => image)
        setProduct(prevProduct => ({
            ...prevProduct,
            images: [...prevProduct.images, ...newImages]
        }))
    }


    // IMAGES ITEM DELETE //
    const deleteImage = (index) => {
        setProduct(prevImages => {
            const updatedImages = [...prevImages.images]
            updatedImages.splice(index, 1)
            return { ...prevImages, images: updatedImages }
        })
    }
    


    // MAIN RENDERING //
    return (

        <div className="add_product_global_container">
            {onLoader &&
                <div className='add_product_load_success_global_container'>
                    <div className='add_product_load_success_container'>
                        {loader ?
                        <div className='add_product_loader_spin'>
                            <CustomLoader />
                        </div>
                        :
                        <div className='add_product_success_container'>
                            <svg className="add_product_success_icon" viewBox="0 0 20 20">
							    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
						    </svg>
                            <p>produit ajouter avec succes</p>
                        </div>
                        } 
                    </div>
                </div>
            }
            <div className='add_product_form_global_container'>
                <div className='add_product_form_container'>
                    <div className='add_product_principale_image_container'>
                        <p>Aperçu image principale</p>
                        <div className="add_product_image" style={{backgroundImage: `url('${!imageFlag.current ? AddImage : imageUrl}')`}}></div>
                    </div>
                    <div className='add_product_container'>
                        <div className='add_product_item'>
                            <label>Name</label>
                            <input type='text' name='name' value={product.name} onChange={(e) => handleInputChange(e.target.name, e.target.value)}/>
                        </div>
                        <div className='add_product_item'>
                            <label>Details</label>
                            <textarea name='details' value={product.details} onChange={(e) => handleInputChange(e.target.name, e.target.value)}></textarea>
                        </div>
                        <div className='add_product_item'>
                            <label>Price</label>
                            <input type='number' name='price' value={product.price} onChange={(e) => handleInputChange(e.target.name, e.target.value)} ref={priceInputRef}></input>
                        </div>
                        <div className='add_product_item add_product_img_input'>
                            <label>image principale</label>
                            <input type='file' name='image' onChange={(e) => handleImageChange(e.target.files[0])} />
                        </div>
                        <div className='add_product_item add_product_imgs_input'>
                            <label>autres images</label>
                            <input type="file" name="images[]" onChange={handleImagesChange} multiple /> 
                        </div>
                    </div>
                </div>
                <div className='add_product_images_secondaire_container'>
                    <p>Aperçu des images secondaire</p>
                    <ImagesDisplay images={product.images} imageRef={imagesDisplayContainerRef} deleteImage={deleteImage} product={product} />
                </div>
                <div className='add_product_btn_container'>
                    <button className='btn_new_product_add' onClick={handleSubmit}>ajouter</button>
                </div>
            </div>
        </div>
        
    )
}


// MODULE EXPORT //
export default AddProduct