// MODULES IMPORTS //
import React, {useState, useRef, useEffect} from 'react'
import '../../styles/pages.admin/addProduct.css'
import { productService } from '../../_services/products.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import {NameMaxLength, NameForbidden, DetailsMaxLength, DetailsForbidden, 
        PriceForbidden, MAX_FILE_SIZE, SUPPORTED_FORMATS
} from '../../_utils/regex/addEdditProduct.regex'
const AddImage = require('../../images/AddImage.jpg')


// MAIN FUNCTION //
const AddProduct = () => {

    // STATES //
    const [product, setProduct] = useState({name: "", price: "", details: "", image: null, images: []})
    const [imageUrl, setImageUrl] = useState()
    const [imagesUrl, setImagesUrl] = useState([])
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)
    const [imageUploaded, setImageUploaded] = useState(false)
    const [nameError, setNameError] = useState("")
    const [detailsError, setDetailsError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [imageError,setImageError] = useState("")
    const [imagesError,setImagesError] = useState("")
    const [productExist, setProductExist] = useState("")


    // REFERENCES //
    const imagesContainerRef = useRef()
    const priceInputRef = useRef()
    const formRef = useRef()


    // IMAGES CONTAINER HORIZONTAL SCROLL //
    useEffect(() => {
        if (imagesContainerRef.current) {
            imagesContainerRef.current.scrollTo({left: imagesContainerRef.current.scrollWidth, behavior: 'smooth'})
        }
    }, [product])


    // Disable scroll on price field
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
    

    // FORM SUBMIT HANDLER //
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!product.name || !product.details || !product.price || !product.image) {
            if (!product.name) setNameError("Le nom du produit est requis");
            if (!product.details) setDetailsError("Les détails du produit sont requis");
            if (!product.price) setPriceError("Le prix du produit est requis");
            if (!product.image) setImageError("Une image principale est requise");
            return;
        }
        try {
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
            await productService.createProduct(formData)
            formRef.current.reset()
            setImageUrl("")
            setImagesUrl([])
            setImageUploaded(false)
            setLoader(false)
            setTimeout(() => setOnLoader(false), 2000)
        }
        catch (err) {
            if (err.response?.status === 409) {
                console.log(err.response)
                setProductExist(err.response.data.message)
            } else if (err.response?.status === 400) {
                err.response.data.errors.map(({field, message}) => {
                    if (field === 'name') {
                        setNameError(message)
                    } else if (field === 'details') {
                        setDetailsError(message)
                    } else if (field === 'price') {
                        setPriceError(message)
                    } else if (field === 'image') {
                        setImageError(message)
                    } else if (field === 'images') {
                        setImagesError(message)
                    }
                })
            }
            console.error(err)
        }
    }
    

    // NAME_DETAILS_PRICE FIELDS HANDLER //
    const handleInputChange = (name, value) => {
        setProduct({
            ...product,
            [name]: value
        })
    }


    // IMAGE FIELDS HANDLER //
    const handleImageChange = (image) => {
        setProduct({
            ...product,
            image: image
        })
        const newUrl = URL.createObjectURL(image)
        setImageUrl(newUrl)
        setImageUploaded(true)
    }


    // IMAGES FIELDS HANDLER //
    const handleImagesChange = (images) => {
        setProduct({
            ...product,
            images: [...product.images, ...images]
        })
        const newUrls = images.map(image => URL.createObjectURL(image))
        setImagesUrl([...imagesUrl, ...newUrls])
    }


    // IMAGES PREVIEW DELETE //
    const deleteImage = (index) => {
        setImagesUrl(prevImages => {
            return prevImages.filter((_, i) => i !== index);
        });
        setProduct(prevProduct => ({
            ...prevProduct,
            images: prevProduct.images.filter((_, i) => i !== index)
        }));
    };


    // INPUTS ERRORS HANDLER //
    const handleFieldsErrors = (name, value) => {
        if (name === 'name') {
            if (!value) {
                setNameError("Le nom du produit est requis")
            } else if (!NameMaxLength.test(value)) {
                setNameError("Le nom du produit ne doit pas dépasser 100 caractères")
            } else if (!NameForbidden.test(value)) {
                setNameError("Le nom du produit contient des caractères invalides")
            } else {
                setNameError("")
                handleInputChange(name, value)
            }
        }
        if (name === 'details') {
            if (!value) {
                setDetailsError("Les détails du produit sont requis")
            } else if (!DetailsMaxLength.test(value)) {
                setDetailsError("Les détails du produit ne doivent pas dépasser 500 caractères")
            } else if (!DetailsForbidden.test(value)) {
                setDetailsError("Les détails du produit contiennent des caractères invalides")
            } else {
                setDetailsError("")
                handleInputChange(name, value)
            }
        }
        if (name === 'price') {
            if (!value)  {
                setPriceError("Le prix du produit est requis")
            } else if (!PriceForbidden.test(value)) {
                setPriceError("Le prix doit etre un nombre positif")
            } else {
                setPriceError("")
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
        if (name === 'images[]') {
            const images =  Array.from(value)
            images.map(image => {
                if (!SUPPORTED_FORMATS.includes(image.type)) {
                    setImagesError("Format invalide, (png, jpg, jpeg) seulement")
                } else if (image.size > MAX_FILE_SIZE) {
                    setImagesError("Votre image ne doit pas depassé 2MB")
                } else if (images.length > 10 || product.images.length > 10) {
                    setImagesError("Nombre d'image depassé (maximum 10 images)")
                } else {
                    setImagesError("")
                    handleImagesChange(images)
                }
            })
        }
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
                        <div className="add_product_image" style={{backgroundImage: `url('${!imageUploaded ? AddImage : imageUrl}')`}}></div>
                    </div>
                    <form className='add_product_container' onSubmit={handleSubmit} ref={formRef}>
                        <div className='add_product_item'>
                            <label>Name</label>
                            <input
                                type='text' 
                                name='name' 
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            />
                            {nameError.length > 0 &&
                                <p className='add_product_error'>{nameError}</p>
                            }
                            {productExist.length > 0 &&
                                <p className='add_product_error'>{productExist}</p>
                            }
                        </div>
                        <div className='add_product_item'>
                            <label>Details</label>
                            <textarea
                                name='details'
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            >
                            </textarea>
                            {detailsError.length > 0 &&
                                <p className='add_product_error'>{detailsError}</p>
                            }
                        </div>
                        <div className='add_product_item'>
                            <label>Price</label>
                            <input
                                type='number' 
                                name='price' 
                                ref={priceInputRef}
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            />
                            {priceError.length > 0 &&
                                <p className='add_product_error'>{priceError}</p>
                            }
                        </div>
                        <div className='add_product_item add_product_img_input'>
                            <label>image principale</label>
                            <input 
                                type='file' 
                                name='image'
                                onBlur={(e) => handleFieldsErrors(e.target.name, e.target.files[0])}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.files[0])}
                            />
                            {imageError.length > 0 &&
                                <p className='add_product_error'>{imageError}</p>
                            }
                        </div>
                        <div className='add_product_item add_product_imgs_input'>
                            <label>autres images</label>
                            <input 
                                type="file" 
                                name="images[]"
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.files)} multiple
                            />
                            {imagesError.length > 0 &&
                                <p className='add_product_error'>{imagesError}</p>
                            }
                        </div>
                        <div className='add_product_btn_container'>
                            <input type='submit' className='btn_new_product_add' value='ajouter'/>
                        </div>
                    </form>
                </div>
                <div className='add_product_images_secondaire_container'>
                    <p>Aperçu des images secondaire</p>
                    <div className="add_product_image_container" ref={imagesContainerRef}>
                        {imagesUrl.length > 0 && (
                            imagesUrl.map((image, index) => (
                                <div className="add_product_images_container" key={index}>
                                    <i className="fa-solid fa-circle-xmark" id='add_product_images_close_icon' onClick={() => deleteImage(index)}></i>
                                    <div className="add_product_images" style={{backgroundImage: `url('${image}')`}}></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>   
    )
}


// MODULE EXPORT //
export default AddProduct