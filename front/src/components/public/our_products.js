import React, { useState, useRef, useEffect } from "react"
import { useNavigate, Link} from "react-router-dom"
import { productService } from '../../_services/products.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import '../../styles/components.public/our_products.css'


const OurProducts = () => {

    // States //
    const [products, setProducts] = useState()
    const [isLoad, setISload] = useState(false)
    const [refNotfound, setRefNotfound] = useState(false)


    // Navigate
    //const navigate = useNavigate()


    // Reference //
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

    const getProducts = async () => {
        try {
            const products_res = await productService.getAllproducts()
            setProducts(products_res.data.data)
            setISload(true)
        }
        catch (err) {
            handleError(err)
        }
    }


    // Get all products
    useEffect(() => {
        if (flag.current === false) {
            getProducts()
        }
        return () => flag.current = true
    }, [])


    // Loader //
    if (!isLoad) {
        return <CustomLoader/>
    }



     // Rendering //
    return (
        <div className="our_products_parent_container">
            {!refNotfound ?
                products.map(product => (
                <div key={product.id} className='our_products_img_englob'>
                    <Link to={`/produit_details/${product.id}`}>{<div className='our_products_img_container' style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${product.image}')`}}></div>}</Link>
                    <div className='our_products_info'>
                        <p className='our_products_name'>{product.name}</p>
                        <div className='our_products_prix_notes'>
                            <p>{product.price} Da</p>
                            <div className='our_products_note'>
                                    <i className="fa-solid fa-star" style={{ color: product.note >= 1 ? 'gold' : '' }}></i>
                                    <i className="fa-solid fa-star" style={{ color: product.note >= 2 ? 'gold' : '' }}></i>
                                    <i className="fa-solid fa-star" style={{ color: product.note >= 3 ? 'gold' : '' }}></i>
                                    <i className="fa-solid fa-star" style={{ color: product.note >= 4 ? 'gold' : '' }}></i>
                                    <i className="fa-solid fa-star" style={{ color: product.note >= 5 ? 'gold' : '' }}></i>
                            </div>
                        </div>
                    </div>
                </div>
                ))
                :
                <div>{products}</div>
            }
            <div className="our_products_go_more">
                <div className="blinking-arrow">
                    <div className="arrow">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
    )
}



export default OurProducts