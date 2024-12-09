// MODULES //
import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { shoppingSerive } from '../../_services/shoppingCart.service'
import '../../styles/pages.public/panier.css'
//import OurProducts from '../../components/public/our_products'
import { favoriteProductService } from '../../_services/favoritesProducts.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useDispatch } from 'react-redux'
import { updatefavsCarts } from '../../redux/reducers/favCartSlice'
import { updateFavsProducts } from '../../redux/reducers/favPrdSlice'
import { useSelector } from 'react-redux'


// MAIN FUNCTION //
const Panier = () => {

    // STATES //
    const [products, setProducts] = useState()
    const [isLoad, setISload] = useState(false)
    const [refConfirm, setRefConfirm] = useState()
    const [refNotfound, setRefNotfound] = useState(false)
    const [fixingScroll, setFixingScroll] = useState(false)
    const [shoppingProductGlobal, setShoppingProductGlobal] = useState({
        display: 'flex',
        width: '90%',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        backgroundColor: 'white',
        margin: '0 auto',
        paddingTop: '20px',
    })

    
    // Redux set
    const favCartcount = useSelector((state) => state.favCartCount.count)
    const dispatch = useDispatch()
    

    
    // REFERENCE //
    const refuseEffect = useRef(false)
    const scrollFixing = useRef()
    const shoppingNoProducts = useRef()


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

    // GET ALL PRODUCTS FUNCTION //
    const getShopping = async () => {

        try {
            // Get all products 
            const productsResponse = await shoppingSerive.shoppingGet()

            const productsData = productsResponse.data.data
            
            // Get all favotes products
            const favoritesProducts = await favoriteProductService.favoriteProductGetAll()
        
            // Get favorite product id from favoritesProducts table
            const favoriteIds = favoritesProducts.data.data === "aucun produit favori" ? false : favoritesProducts.data.data.map(favorite => favorite.product_id) 

            // Update state
            setProducts(productsData.map(shopping => ({
                id: shopping.shopping_cart_product.id,
                name: shopping.shopping_cart_product.name,
                price: shopping.shopping_cart_product.price,
                image: shopping.shopping_cart_product.image,
                total_price: shopping.total_price,
                product_count: shopping.product_count,
                favorite: favoriteIds === false ? false : favoriteIds.includes(shopping.shopping_cart_product.id) ? true : false
            })))

            // Update loader 
            setISload(true)
        }
        catch (err) {
            handleError(err)
        }
    }


    // GET ALL PRODUCTS AND COUNT IN SHOPPING CART //
    useEffect(() => {

        if (refuseEffect.current === false) {

            // Get all shopping carts
            getShopping()
        }
        return () => refuseEffect.current = true
    }, [])


    // INCREASE PRODUCTS QUANTITY HANDLE //
    const upQuantity = async (productId) => {
        try {
            // Set product id
            const cartItem = { id: productId }

            // Api call for add product
            await shoppingSerive.shoppingAdd(cartItem)

            // Api call for get product
            await shoppingSerive.shoppingGet()
            
            // Update state
            getShopping()
        }
        catch (err) {
            console.error(err)
        }
    }


    // DECREASE PRODUCT QUANTITY HANDLE //
    const downQuantity = async (productId) => {
        try {
            const currentProduct = products.find(product => product.id === productId)

            if (currentProduct.product_count > 1) {
                // api call for subtracting product
                await shoppingSerive.shoppingDelete(productId)

                // api call for get product
                await shoppingSerive.shoppingGet()

                // Update state
                getShopping()
            }
        } catch (err) {
            console.error(err)
        }
    }


    // WRITE PRODUCTS QUANTITY HANDLE //
    const writeQuantity = (index, newQuantity) => {
        try {
            const updatedProducts = [...products]
            updatedProducts[index].product_count = newQuantity
            setProducts(updatedProducts)
            setRefConfirm(index)
        }
        catch (err) {
            console.error(err)
        }
    }


    //CHOOSED PRODUCTS QUANTITY HANDLE //
    const choosedQuantity = async (newQuantity, productId) => {
        try {
           
            newQuantity === "" && (newQuantity = 1)
    
            // Set product id
            const cartItem = { id: productId, quantity: newQuantity }
    
            // Api call for add product
            await shoppingSerive.shoppingAdd(cartItem)
    
            // Api call for get product
            await shoppingSerive.shoppingGet()

            // Update state
            getShopping()
        }
        catch (err) {
            console.error(err)
        }
    }


    // DELETE AN SHOPPING CART //
    const deleteCarts = async (productId) => {   

        try {
            // api call for delete product
            await shoppingSerive.shoppingSomesDelete(productId) 

            // api call for get product
            const cartCount = await shoppingSerive.shoppingCount()

            console.log(cartCount.data.data.length)

            // Update context
            dispatch(updatefavsCarts({count: cartCount.data.data.length}))
            
            // Update state
            getShopping()
        }
        catch (err) {
            if (err.response && err.response.status === 404) {
                getShopping()
            }
        }
    }


    // ADD PRODUCT TO FAVORITES //
    const addTofavorite = async (productId, event) => {
        try {
            // Get css style of icon 
            const heartIcon = event.currentTarget
            const computedStyle = window.getComputedStyle(heartIcon)
            const color = computedStyle.getPropertyValue('fill')
    
            if (color === 'rgb(0, 0, 0)') {
                
                // Api call for add favorite product
                const favorites_products_add = await favoriteProductService.favoriteProductAdd({ id: productId })

                // Update state context
                dispatch(updateFavsProducts({count: favorites_products_add.data.data.length}))

                // Change icon color
                heartIcon.style.fill = 'lightseagreen'

            } else {
                // Api call for delete favorite product
                await favoriteProductService.favoriteProductDelete(productId)

                // Api call for get all favorites products
                const favorites_products_del = await favoriteProductService.favoriteProductCount()

                // Update context
                dispatch(updateFavsProducts({count: favorites_products_del.data.data.length}))

                // Change icon color
                heartIcon.style.fill = 'rgb(0, 0, 0)'
            }
        } catch (err) {
            console.error(err)
        }
    }

    // SCROLL FIXING //
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const offsetTop = scrollFixing.current ? scrollFixing.current.offsetTop : 0;

            if (scrollTop > offsetTop) {
                setFixingScroll(true);
            } else {
                setFixingScroll(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('scroll', handleScroll);
    }, [])


    useEffect(() => {
        if (shoppingNoProducts.current) {
            setShoppingProductGlobal({
                display: 'flex',
                width: '90%',
                justifyContent: 'center',
                flexWrap: 'wrap',
                backgroundColor: 'rgba(244, 244, 244, 0.717)',
                margin: '0 auto',
                padding: '100px 20px',
            })
        }
    }, [products])
    
   
    // LOADER //
    if (!isLoad) {
        return <div style={{marginTop: '300px'}}><CustomLoader/></div>
    }


    // RENDERING //
    return (
        <div className="main_container">
            <div className="shopping_details_back_home">
                <Link to="/home">
                    <p>acceuil</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4l8 8-8 8" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Link>
                <p>panier</p>
            </div>
            <div style={shoppingProductGlobal}>
                <div className="shopping_product_content_items">
                    {!refNotfound ? (
                    products.map((shopping, index) => (
                            <div key={shopping.id} className="shopping_product_container">
                                <div className="shopping_fav_and_delete_container">
                                    <div className="shopping_fav_and_delete_sub_container">
                                        <svg style={shopping.favorite === true ? {height:'20px', width:'20px', fill: 'lightseagreen', cursor: 'pointer'} : {height:'20px', width:'20px', fill: 'black', cursor: 'pointer'}} onClick={(e) => addTofavorite(shopping.id, e)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                            <path d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z"/>
                                        </svg>
                                        <svg data-v-84c63b90="" data-v-94da03a8="" onClick={() => deleteCarts(shopping.id)} xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" cursor="pointer" role="presentation" class="svg" data-v-8ffe78fc=""><g data-v-84c63b90="" fill="currentColor" stroke="currentColor"><svg data-v-94da03a8="" data-v-84c63b90="" viewBox="0 0 20 20" stroke="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="">
                                            <path data-v-94da03a8="" data-v-84c63b90="" d="M3 5H4.55556L17 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path data-v-94da03a8="" data-v-84c63b90="" d="M7.14286 5V3.4C7.14286 3.0287 7.29337 2.6726 7.56128 2.41005C7.82919 2.1475 8.19255 2 8.57143 2H11.4286C11.8075 2 12.1708 2.1475 12.4387 2.41005C12.7066 2.6726 12.8571 3.0287 12.8571 3.4V5M15 5V15.6C15 15.9713 14.8495 16.3274 14.5816 16.5899C14.3137 16.8525 13.9503 17 13.5714 17H6.42857C6.04969 17 5.68633 16.8525 5.41842 16.5899C5.15051 16.3274 5 15.9713 5 15.6V5H10H15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg></g></svg>
                                    </div>
                                </div>
                                <div className="shopping_img_and_details_container">
                                    <Link to={`/produit_details/${shopping.id}`}>
                                        <div className="shopping_product_img" style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${shopping.image}')`}}></div>
                                    </Link>
                                    <div className="shopping_product_details_container">
                                        <Link to={`/produit_details/${shopping.id}`}>
                                            <div className="shopping_product_item product_item_name">
                                                <p>{shopping.name}</p>
                                            </div>
                                        </Link>
                                        <div className="shopping_product_item product_item_price">
                                            <p>Prix unitaire :</p>
                                            <p>{shopping.price} da</p>
                                        </div>
                                        <div className="shopping_product_item product_item_quantity">
                                            <p>Quantité :</p>
                                            <div className="quantity_container">
                                                <button onClick={() => downQuantity(shopping.id)}>-</button>
                                                <input type="number" max="90" min="1" className="quantity_input" value={shopping.product_count} onChange={(e) => writeQuantity(index, e.target.value)}/>
                                                {index === refConfirm && <div onClick={() => choosedQuantity(shopping.product_count, shopping.id)} className="btn_confirm_quantity" >confirmer</div>}
                                                <button onClick={() => upQuantity(shopping.id)}>+</button>
                                            </div>
                                        </div>
                                        <div className="shopping_product_item product_item_totalPrice">
                                            <p>Montant total :</p>
                                            <p>{shopping.total_price} da</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    ))
                    )
                    : (
                        <>
                            <div className="shopping_no_product_add" ref={shoppingNoProducts}>
                                <p style={{fontSize: '18px', fontFamily: 'Calibri', letterSpacing: '1px'}}>{products}</p>
                                <div className="shopping_no_product_image">
                                    <svg class="svg-icon" viewBox="0 0 20 20">
                                        <path fill="none" d="M17.72,5.011H8.026c-0.271,0-0.49,0.219-0.49,0.489c0,0.271,0.219,0.489,0.49,0.489h8.962l-1.979,4.773H6.763L4.935,5.343C4.926,5.316,4.897,5.309,4.884,5.286c-0.011-0.024,0-0.051-0.017-0.074C4.833,5.166,4.025,4.081,2.33,3.908C2.068,3.883,1.822,4.075,1.795,4.344C1.767,4.612,1.962,4.853,2.231,4.88c1.143,0.118,1.703,0.738,1.808,0.866l1.91,5.661c0.066,0.199,0.252,0.333,0.463,0.333h8.924c0.116,0,0.22-0.053,0.308-0.128c0.027-0.023,0.042-0.048,0.063-0.076c0.026-0.034,0.063-0.058,0.08-0.099l2.384-5.75c0.062-0.151,0.046-0.323-0.045-0.458C18.036,5.092,17.883,5.011,17.72,5.011z"></path>
                                        <path fill="none" d="M8.251,12.386c-1.023,0-1.856,0.834-1.856,1.856s0.833,1.853,1.856,1.853c1.021,0,1.853-0.83,1.853-1.853S9.273,12.386,8.251,12.386z M8.251,15.116c-0.484,0-0.877-0.393-0.877-0.874c0-0.484,0.394-0.878,0.877-0.878c0.482,0,0.875,0.394,0.875,0.878C9.126,14.724,8.733,15.116,8.251,15.116z"></path>
                                        <path fill="none" d="M13.972,12.386c-1.022,0-1.855,0.834-1.855,1.856s0.833,1.853,1.855,1.853s1.854-0.83,1.854-1.853S14.994,12.386,13.972,12.386z M13.972,15.116c-0.484,0-0.878-0.393-0.878-0.874c0-0.484,0.394-0.878,0.878-0.878c0.482,0,0.875,0.394,0.875,0.878C14.847,14.724,14.454,15.116,13.972,15.116z"></path>
                                    </svg>
                                </div>
                                <Link to="/home">
                                    <div className="shopping_back_home">
                                        <svg className="shopping_back_menu_svg-icon" viewBox="0 0 20 20">
                                            <path fill="none" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
                                            L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
                                            c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
                                            c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
                                            S18.707,9.212,18.271,9.212z"></path>
                                        </svg>
                                        <p>page d'acceuil</p>
                                    </div>
                                </Link>
                            </div>
                        </>
                    )
                    }
                </div>
                <div className="shopping_total_price_and_commande_global_container">
                    <div style={{display: !refNotfound ? "flex" : "none"}} className= {fixingScroll ? "shopping_total_price_and_commande_container shopping_total_price_and_commande_container_fixed" : "shopping_total_price_and_commande_container"} ref={scrollFixing}>
                        <div className="shopping_total_price_and_commande">
                            <div className="shopping_prices_container">
                                <div className="shopping_total_price">
                                    <p style={{textAlign:"left"}}>Frais de livraison :</p>
                                    <p style={{color:"rgb(87, 86, 86)"}}>500 Da</p>
                                </div>
                                <div className="shopping_total_price">
                                    <p style={{textAlign:"left"}}>Sous-total :</p>
                                    <p style={{color:"rgb(87, 86, 86)"}}>{!refNotfound ? products.reduce((total, product) => total + parseFloat(product.total_price), 0).toFixed(2): null} Da</p>
                                </div>
                                <div className="shopping_total_price">
                                    <p style={{textAlign:"left"}}>Montant total :</p>
                                    <p style={{color:"rgb(87, 86, 86)"}}>{!refNotfound ? products.reduce((total, product) => total + parseFloat(product.total_price), 0).toFixed(2): null} Da</p>
                                </div>
                            </div>
                            <div className="shopping_commande">
                                <p>Je commande</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*
            <div className="our_products_global_container">
                <h1>nos derniers produtis</h1>
                <OurProducts/>
            </div>
            */}
        </div>
    ) 
}


// EXPORTS //
export default Panier