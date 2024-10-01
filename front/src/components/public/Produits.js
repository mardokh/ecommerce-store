import React, { useEffect, useRef, useState, useContext } from 'react'
import '../../styles/components.public/produits.css'
import { productService } from '../../_services/product.service'
import { shoppingSerive } from '../../_services/shoppingCart.service'
import { useNavigate, Link } from 'react-router-dom'
import { favoriteProductService } from '../../_services/favoriteProduct.service'
//import MyContext from '../../_utils/contexts'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useDispatch } from 'react-redux'
import { updateFavsProducts } from '../../redux/reducers/favPrdSlice'
import { updatefavsCarts } from '../../redux/reducers/favCartSlice'


const Produits = () => {

    // States
    const [products, setProducts] = useState()
    const [isLoad, setISload] = useState(false)
    const [refNotfound, setRefNotfound] = useState(false)

    // Redux set
    const dispatch = useDispatch()

    /*
    const { updateFavoritesProductsCount } = useContext(MyContext)
    const { updateShoppingCartCount } = useContext(MyContext)
    */

    // Navigate
    const navigate = useNavigate() 

    // Reference
    const flag = useRef(false)

    // Handle errors
    const handleError = (err) => {
        if (err.response && err.response.status) {
            setRefNotfound(true)
            setProducts(err.response.data.data)
            setISload(true)
        } else {
            console.log('Error:', err.message)
        }
    }

    // GET ALL PRODUCTS FUNCTION
    const getProducts = async () => {
        try {
            const productsResponse = await productService.getAllproducts()
            const productsData = productsResponse.data.data
            
            const favoritesProducts = await favoriteProductService.favoriteProductGetAll()
            const favoriteIds = favoritesProducts.data.data === "aucun produit favori" ? false : favoritesProducts.data.data.map(favorite => favorite.product_id) 

            setProducts(productsData.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                note: product.note,
                image: product.image,
                favorite: favoriteIds === false ? false : favoriteIds.includes(product.id)
            })))

            setISload(true)
        } catch (err) {
            handleError(err)
        }
    }

    // API CALL FOR GET ALL PRODUCTS
    useEffect(() => {
        if (flag.current === false) {
            getProducts()
        }
        return () => flag.current = true
    }, [])

    // ADD PRODUCT TO SHOPPING CARTS
    const addToCart = async (productId) => {
        try {
            await shoppingSerive.shoppingAdd({ id: productId })
            const shopping_cart_add = await shoppingSerive.shoppingGet()
            dispatch(updatefavsCarts({count: shopping_cart_add.data.data.length}))
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
                    
                    // Api call for add favorite product
                    const favorites_products_add = await favoriteProductService.favoriteProductAdd({ id: productId })
    
                    // Update state context
                    dispatch(updateFavsProducts({count: favorites_products_add.data.data.length}))
    
                    // Change icon color
                    heartIcon.style.color = 'rgb(228, 60, 60)'
    
                } else {
                    // Api call for delete favorite product
                    await favoriteProductService.favoriteProductDelete(productId)
    
                    // Api call for get all favorites products
                    const favorites_products_del = await favoriteProductService.favoriteProductCount()
    
                    // Update context
                    dispatch(updateFavsProducts({count: favorites_products_del.data.data.length}))
    
                    // Change icon color
                    heartIcon.style.color = 'rgba(0, 128, 0, 0.45)'
                }
            } catch (err) {
                console.error(err)
            }
        }

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

    // Rendering
    return (
        <div className="produits_global_container">
            <div className='produits_tout_voir'>
                <p>Nos Produits</p>
                <p>Tout voir  &gt;&gt;</p>
            </div>
            <div className="produits_parent_container">
                {!refNotfound ?
                    products.map(product => (
                        <div key={product.id} className='produits_img_englob'>
                            <div className='produits_favorite_icon_container'>
                                <Link>
                                    <i className={`fa-solid fa-heart ${product.favorite && 'favorite'}`} onClick={(e) => addTofavorite(product.id, e)}></i>
                                </Link>
                            </div>
                            <Link to={`/produit_details/${product.id}`}>
                                <div className='produits_img_container' style={{ backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${product.image}')` }}></div>
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
