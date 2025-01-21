import React, { useEffect, useRef, useState } from 'react'
import '../../styles/components.public/produits.css'
import { productService } from '../../_services/products.service'
import { shoppingSerive } from '../../_services/shoppingCart.service'
import { useNavigate, Link } from 'react-router-dom'
import { favoriteProductService } from '../../_services/favoritesProducts.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useDispatch, useSelector } from 'react-redux'
import { updateFavsProducts } from '../../redux/reducers/favPrdSlice'
import { updatefavsCarts } from '../../redux/reducers/favCartSlice'
import Cookies from 'js-cookie'
import FavoritesConcur from '../../_utils/raceConcurrency/favorites.concur'


const Produits = () => {

    // States
    const [products, setProducts] = useState()
    const [isLoad, setISload] = useState(false)
    const [notFound, setNotfound] = useState(false)
    const [raceConcur, setRaceConcur] = useState(false)
    const [exist, setExist] = useState(false)
    const [deleted, setDeleted] = useState(false)


    // REDUX //
    const dispatch = useDispatch()
    const favPrdcount = useSelector((state) => state.favPrdCount.count)
    const favCartCount = useSelector((state) => state.favCartCount.count)


    // Navigate
    const navigate = useNavigate()


    // GET PRODUCTS
    const getProducts = async () => {

        try {
            // Get products
            const products = await productService.getAllproducts()

            // Set favorite id
            let favId = false

            // Get cookie from browser
            const favoritesCookie = Cookies.get('client_id_favorites_products')

            // If cookie exist get favorites
            if (favoritesCookie) {
                try {
                    // Get favorites
                    const favorites = await favoriteProductService.favoriteProductGetAll()
    
                    // Filter favorite ids
                    favId = favorites.data.data.map(favorite => favorite.product_id)
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
            setProducts(products.data.data.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                note: product.note,
                image: product.image,
                favorite: !favId ? false : favId.includes(product.id)
            })))

            // Set loader
            setISload(true)
        }
        catch (err) {
            if (err.response && err.response.status === 404) {
                setProducts(err.response.data.message)
                setNotfound(true)
                setISload(true)
            } 
            else {
                console.error(err)
            }
        }
    }


    // GET PRODUCTS ON LOAD
    useEffect(() => {
        getProducts()
    }, [])

    
    // ADD PRODUCT TO SHOPPING CARTS
    const addToCart = async (productId) => {
        try {
            await shoppingSerive.shoppingCreate({ id: productId })
            await shoppingSerive.shoppingGet()
            dispatch(updatefavsCarts({count: favCartCount + 1}))
            navigate('/panier')
        } catch (err) {
            console.error(err)
        }
    }

    // ADD PRODUCT TO FAVORITES //
    const addTofavorite = async (productId, event) => {
        try {
            // Get css style of icon 
            const heartIcon = event.currentTarget
            const computedStyle = window.getComputedStyle(heartIcon)
            const color = computedStyle.color
    
            if (color === 'rgba(0, 128, 0, 0.45)') {
                
                // Add favorite
                await favoriteProductService.favoriteProductCreate({ id: productId })

                // Update favorites count
                dispatch(updateFavsProducts({count: favPrdcount + 1}))

                // Change icon color
                heartIcon.style.color = 'rgb(228, 60, 60)'
            } 
            else {
                // Delete favorite
                await favoriteProductService.favoriteProductDelete(productId)

                // Update favorites count
                dispatch(updateFavsProducts({count: favPrdcount - 1}))

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
            <div className="product_rating_star_container">
                {[...Array(fullStars)].map((_, index) => (
                    <svg key={index} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="product_rating_star_enable">
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
                    <svg key={index} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="product_rating_star_disable">
                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                    </svg>
                ))}
            </div>
        )
    }

    // Loader
    if (!isLoad) {
        return <CustomLoader />
    }

    
    return (
        <div className="produits_global_container">
            {raceConcur &&
                <FavoritesConcur exist={exist} deleted={deleted}/>
            }
            <div className="produits_parent_container">
                {!notFound ?
                    products.map(product => (
                        <div key={product.id} className='produits_img_englob'>
                            <div className='produits_favorite_icon_container'>
                                <Link>
                                    <i className={`fa-solid fa-heart ${product.favorite && 'favorite'}`} onClick={(e) => addTofavorite(product.id, e)}></i>
                                </Link>
                            </div>
                            <Link to={`/produit_details/${product.id}`}>
                                <div className='produits_img_container' style={{ backgroundImage: `url('${process.env.REACT_APP_SERVER_HOST}/uploads/${product.image}')` }}></div>
                            </Link>
                            <div className='produit_info'>
                                <p className='produits_name'>{product.name}</p>
                                <div className='prix_notes'>
                                    <p>{product.price} Da</p>
                                    {renderStars(product.note)}
                                </div>
                                <button className='add_cart' onClick={() => addToCart(product.id)}>ajouter au panier</button>
                            </div>
                        </div>
                    )) : 
                    <div className='produits_section_vide'>
                        <p>{products}</p>
                    </div>
                }
            </div>
        </div>
    )
}

// MODULES EXPORTS
export default Produits