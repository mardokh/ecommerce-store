import React, { useEffect, useRef, useState } from 'react'
import '../../styles/pages.admin/editProduct.css'
import { productService } from '../../_services/product.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useParams } from "react-router-dom"



const EditProduct = () => {

    // STATES //
    const [product, setProduct] = useState({id: null, name: "", price: "", details: "", image: "", images: []})
    const [imageUrl, setImageUrl] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [loader, setLoader] = useState(false)
    const [onLoader, setOnLoader] = useState(false)
    const [imageFlag, setImageFlag] = useState(false)


    // REFERENCE //
    const effectFlag = useRef(false)
    const imagesDisplayContainerRef = useRef()


    // GET ID PARAMS
    const {id} = useParams()


    // API CALL FOR GET PRODUCT //
    useEffect(() => {

        if (effectFlag.current === false) {
            productService.getOneProduct(id)
                .then(res => {
                    setProduct({
                        id: res.data.data.id,
                        name: res.data.data.name, 
                        price: res.data.data.price, 
                        details: res.data.data.details, 
                        image: res.data.data.image, 
                        images: res.data.data.product_images.map(item => item)
                    })
                    setIsLoading(true)
                })
                .catch(err => console.error('Error on useEffect getOneProduct : ', err))
        }
        return () => effectFlag.current = true
    }, [])


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
        try {
            // Load data
            setOnLoader(true)
            setLoader(true)

            // Create form
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
    
            // Api call for update product
            await productService.updateProcut(formData)
    
            // Update loader
            setLoader(false)
    
            // Close windows
            setTimeout(() => setOnLoader(false), 2000)

        }
        catch (error) {
            console.error('Error on handleSubmit : ', error)
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
            setImageFlag(true)
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


    // SECONDARYS IMAGES LOCAL DELETE //
    const deleteImage = async (index, imageId) => {

        try {
            setProduct(prevImages => {
                const updatedImages = [...prevImages.images]
                updatedImages.splice(index, 1)
                return { ...prevImages, images: updatedImages }
            })
    
            if (imageId) {
                await productService.deleteSecondaryImage(imageId)
            }
        }
        catch (err) {
            console.error('Error on deleteImage : ', err)
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
                            <p>Modification effecuter avec succes</p>
                        </div>
                        } 
                    </div>
                </div>
            }
            <div className='edit_product_form_global_container'>
                <div className='edit_product_form_container'>
                    <div className='edit_product_principale_image_container'>
                        <p>Aperçu image principale</p>
                        <div className="edit_product_image" style={{backgroundImage: `url('${!imageFlag ? `http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${product.image}` : imageUrl}')`}}></div>
                    </div>
                    <div className='edit_product_container'>
                        <div className='edit_product_item'>
                            <label>Name</label>
                            <input type='text' name='name' value={product.name} onChange={(e) => handleInputChange(e.target.name, e.target.value)}/>
                        </div>
                        <div className='edit_product_item'>
                            <label>Details</label>
                            <textarea name='details' value={product.details} onChange={(e) => handleInputChange(e.target.name, e.target.value)}></textarea>
                        </div>
                        <div className='edit_product_item'>
                            <label>Price</label>
                            <input type='number' name='price' value={product.price} onChange={(e) => handleInputChange(e.target.name, e.target.value)}></input>
                        </div>
                        <div className='edit_product_item edit_product_img_input'>
                            <label>image principale</label>
                            <input type='file' name='image' onChange={(e) => handleImageChange(e.target.files[0])} />
                        </div>
                        <div className='edit_product_item edit_product_imgs_input'>
                            <label>autres images</label>
                            <input type="file" name="images[]" onChange={handleImagesChange} multiple />
                        </div>
                    </div>
                </div>
                <div className='edit_product_images_secondaire_container'>
                    <p>Aperçu des images secondaire</p>
                    <div className="edit_product_image_container" ref={imagesDisplayContainerRef}>
                        {product.images.map((image, index) => (
                            <div className="edit_product_images_container" key={index}>
                                <i class="fa-solid fa-circle-xmark" id='edit_product_images_close_icon' onClick={() => deleteImage(index, image.id)}></i>
                                <div className="edit_product_images" style={{backgroundImage: `url('${image.images ? `http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${image.images}` : URL.createObjectURL(image)}')`}}></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='edit_product_btn_container'>
                    <button className='btn_new_product_edit' onClick={handleSubmit}>confirmer</button>
                </div>
            </div>
        </div>
        
    )
}

export default EditProduct