import React, { useEffect, useRef, useState } from 'react'
import '../../styles/pages.admin/editProduct.css'
import { productService } from '../../_services/products.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useParams } from "react-router-dom"
import {NameMaxLength, NameForbidden, DetailsMaxLength, DetailsForbidden, 
    PriceForbidden, MAX_FILE_SIZE, SUPPORTED_FORMATS
} from '../../_utils/regex/addEdditProduct.regex'


const EditProduct = () => {

    // STATES //
    const [product, setProduct] = useState({id: null, name: "", price: "", details: "", image: null, images: []})
    const [imageUrl, setImageUrl] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)
    const [imageUploaded, setImageUploaded] = useState(false)
    const [imagesUrl, setImagesUrl] = useState([])
    const [nameError, setNameError] = useState("")
    const [detailsError, setDetailsError] = useState("")
    const [priceError, setPriceError] = useState("")
    const [imageError,setImageError] = useState("")
    const [imagesError,setImagesError] = useState("")
    const [onImageDelete, setOnImageDelete] = useState(false)


    // REFERENCE //
    const imagesDisplayContainerRef = useRef()


    // GET ID PARAMS //
    const {id} = useParams()


    // API CALL FOR GET PRODUCT //
    useEffect(() => {
        productService.getOneProduct(id)
        .then(res => {
            const existingImages = res.data.data.product_images.map(item => item); // Extract URLs from DB
            setProduct({
                id: res.data.data.id,
                name: res.data.data.name, 
                price: res.data.data.price, 
                details: res.data.data.details, 
                image: res.data.data.image, 
                images: res.data.data.product_images
            });
            setImagesUrl(existingImages); // Initialize imagesUrl with DB images
            setIsLoading(true);
        })
        .catch(err => console.error('Error on useEffect getOneProduct : ', err));
    }, []);
    


    // IMAGES CONTAINER SCROLL //
    const scrollToRightEnd = () => {
        if (imagesDisplayContainerRef.current) {
            imagesDisplayContainerRef.current.scrollTo({left: imagesDisplayContainerRef.current.scrollWidth, behavior: 'smooth'})
        }
    }
    useEffect(() => {
        scrollToRightEnd()
    }, [product])


    // FORM SUBMIT //
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setOnLoader(true)
            setLoader(true)
            const formData = new FormData()
            formData.append('name', product.name)
            formData.append('price', product.price)
            formData.append('details', product.details)
            formData.append('image', product.image)
            formData.append('id', id)
            for (const file of product.images) {
                if (file instanceof File) {
                    formData.append('images', file)
                }
            }
            await productService.updateProcut(formData)
            setImageUploaded(false)
            setLoader(false)
            setTimeout(() => setOnLoader(false), 2000)
        }
        catch (error) {
            if (err.response?.status === 400) {
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
            console.error('Error : ', err)
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
        const urlImage = URL.createObjectURL(image)
        setImageUrl(urlImage)
        setImageUploaded(true)
    }


    // UPDATE IMAGES STATE //
    const handleImagesChange = (images) => {
        setProduct({
            ...product,
            images: [...product.images, ...images]
        })
        const newUrls = images.map(image => URL.createObjectURL(image))
        setImagesUrl([...imagesUrl, ...newUrls])
    }
    

    // SECONDARYS IMAGES DELETE //
    const deleteImage = async (index, imageId) => {
        try {
            if (imageId) {
                setOnLoader(true)
                setLoader(true)
                await productService.deleteSecondaryImage(imageId)
                setOnImageDelete(true)
                setLoader(false)
                setTimeout(() => setOnLoader(false), 2000)
            }
            setProduct(prevImages => {
                const updatedImages = [...prevImages.images]
                updatedImages.splice(index, 1)
                return { ...prevImages, images: updatedImages }
            })
            setImagesUrl(prevUrls => {
                const updatedUrls = [...prevUrls]
                updatedUrls.splice(index, 1)
                return updatedUrls
            })
        }
        catch (err) {
            console.error('Error on deleteImage : ', err)
        }
    }


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
            }
            handleInputChange(name, value)
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
            }
            handleInputChange(name, value)
        }
        if (name === 'price') {
            if (!value)  {
                setPriceError("Le prix du produit est requis")
            } else if (!PriceForbidden.test(value)) {
                setPriceError("Le prix doit etre un nombre positif")
            } else {
                setPriceError("")
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


    // LOADING HANDLER
    if (!isLoading) {
        return <CustomLoader/>
    }


    // MAIN RENDERING //
    return (
        <div className="edit_product_global_container">
            {onLoader &&
                <div className='edit_product_load_success_global_container'>
                    <div className='edit_product_load_success_container'>
                        {loader ?
                        <div className='edit_product_loader_spin'>
                            <CustomLoader />
                        </div>
                        :
                        <div className='edit_product_success_container'>
                            <svg className="edit_product_success_icon" viewBox="0 0 20 20">
                                <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                            </svg>
                            <p>{onImageDelete ? "Image supprimer avec succes" : "Modification effecuter avec succes"}</p>
                        </div>
                        } 
                    </div>
                </div>
            }
            <div className='edit_product_form_global_container'>
                <div className='edit_product_form_container'>
                    <div className='edit_product_principale_image_container'>
                        <p>Aperçu image principale</p>
                        <div className="edit_product_image" style={{backgroundImage: `url('${imageUploaded ? imageUrl : `${process.env.REACT_APP_SERVER_HOST}/uploads/${product.image}`}')`}}></div>
                    </div>
                    <form className='edit_product_container' onSubmit={handleSubmit}>
                        <div className='edit_product_item'>
                            <label>Name</label>
                            <input 
                                type='text' 
                                name='name' 
                                value={product.name}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            />
                            {nameError.length > 0 &&
                                <p className='edit_product_error'>{nameError}</p>
                            }
                        </div>
                        <div className='edit_product_item'>
                            <label>Details</label>
                            <textarea 
                                name='details' 
                                value={product.details}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}>
                            </textarea>
                            {detailsError.length > 0 &&
                                <p className='edit_product_error'>{detailsError}</p>
                            }
                        </div>
                        <div className='edit_product_item'>
                            <label>Price</label>
                            <input 
                                type='number' 
                                name='price' 
                                value={product.price}
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.value)}
                            />
                            {priceError.length > 0 &&
                                <p className='edit_product_error'>{priceError}</p>
                            }
                        </div>
                        <div className='edit_product_item edit_product_img_input'>
                            <label>image principale</label>
                            <input 
                                type='file' 
                                name='image'
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.files[0])}
                            />
                            {imageError.length > 0 &&
                                <p className='edit_product_error'>{imageError}</p>
                            }
                        </div>
                        <div className='edit_product_item edit_product_imgs_input'>
                            <label>autres images</label>
                            <input 
                                type="file" 
                                name="images[]" 
                                onChange={(e) => handleFieldsErrors(e.target.name, e.target.files)} multiple
                            />
                            {imagesError.length > 0 &&
                                <p className='edit_product_error'>{imagesError}</p>
                            }
                        </div>
                        <div className='edit_product_btn_container'>
                            <input type='submit' className='btn_new_product_edit' value='confirmer'/>
                        </div>
                    </form>
                </div>
                <div className='edit_product_images_secondaire_container'>
                    <p>Aperçu des images secondaire</p>
                    <div className="edit_product_image_container" ref={imagesDisplayContainerRef}>
                        {product.images.map((image, index) => (
                            <div className="edit_product_images_container" key={index}>
                                <i class="fa-solid fa-circle-xmark" id='edit_product_images_close_icon' onClick={() => deleteImage(index, image.id)}></i>
                                <div className="edit_product_images" style={{backgroundImage: `url('${image.images ? `${process.env.REACT_APP_SERVER_HOST}/uploads/${image.images}` : imagesUrl[index]}')`}}></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProduct