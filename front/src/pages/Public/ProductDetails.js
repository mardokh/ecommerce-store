import React, { useEffect, useState, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { productService } from "../../_services/products.service"
import "../../styles/pages.public/product_details.css"
//import ProductNotes from "../../components/public/productNotes"
//import { productsReviewsService } from "../../_services/productsReviews.service"
import ProductsReviews from "../../components/public/ProductsReviews"
import CustomLoader from '../../_utils/customeLoader/customLoader'
//import { productsReviewsService } from "../../_services/productsReviews.service"
import { useDispatch } from 'react-redux'
import { updatePrdReveiwDisplay } from '../../redux/reducers/prdReveiwDisplaySlice'
import { useSelector } from 'react-redux'


const ProductDetails = () => {

    // STATES
    const [product, setProduct] = useState([])
    const [isLoad, setISload] = useState(false)
    const [styleActive, setStyleActive] = useState(false)
    const [imageIndex, setImageIndex] = useState(0)
    const [imageDefault, setImageDefault] = useState(true)
    const [nexImage, setNexImage] = useState("")
    const [nextImageActive, setNextImageActive] = useState(false)


    // REDUX //
    const havePrdComment = useSelector((state) => state.havePrdComment.status)
    const dispatch = useDispatch()


    // GET ID PARAMS
    const {id} = useParams()


    // REFERENCES //
    const flag = useRef(false)
    const sideImagesContainer = useRef()


    // API CALL FOR GET PRODUCT //
    useEffect(() => {
        if (flag.current === false) {
            productService.getOneProduct(id)
            .then(res => {
                //console.log(res)
                const productData = res.data.data
                // Add product.image to product.product_images array
                productData.product_images.unshift({ images: productData.image })
                setProduct(productData)
                setISload(true)
                setImageDefault(false)
                setStyleActive(true)
            })
            .catch(err => console.error('Error : ', err))
        }
        return () => flag.current = true
    }, [])


    // DISPLAY SIDE IMAGE TO MAIN //
    const cornerImageDisplay = (image, index) => {
        setImageDefault(false)
        setImageIndex(index)
        setStyleActive(true)
        setNexImage(image)
        setNextImageActive(true)
    }


    // FROM ANIMATION //
    const goImageRight = () => {
        setNextImageActive(true)
        let nextIndex = imageIndex + 1
        setImageIndex(nextIndex)
        setNexImage(product.product_images[nextIndex].images)
        const newScroll = sideImagesContainer.current.scrollTop + 200
        sideImagesContainer.current.scrollTo({top: newScroll, behavior: 'smooth'})   
    }
    const goImageLeft = () => {
        setNextImageActive(true)
        let nextIndex = imageIndex - 1
        setImageIndex(nextIndex)
        setNexImage(product.product_images[nextIndex].images)
        const newScroll = sideImagesContainer.current.scrollTop - 200
        sideImagesContainer.current.scrollTo({top: newScroll, behavior: 'smooth'})
    }


    // REVIWES FORM HANDLER //
    const dispRviewsForm = () => {
        dispatch(updatePrdReveiwDisplay({status: true}))
    }
    

    // LOADING //
    if (!isLoad) {
        return <CustomLoader/>
    }
    

    return (
        <div className="details_global_container">

            <div className="details_back_home">
                <Link to="/home">
                    <p>home</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4l8 8-8 8" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Link>
                <Link to="/products">
                    <p>products</p>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 4l8 8-8 8" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </Link>
                <p>details</p>
            </div>

            <section className="details_parent_container">

                <div className="details_sideImg_image_parent_container">
                    
                    <div className="details_sideImg_img_container">
                        <div className="details_side_img_sub_container" ref={sideImagesContainer}>
                            <div className="details_side_img">
                                {product.product_images.map((file, index) => (
                                    <div 
                                        key={index}
                                        className={(styleActive && index === imageIndex) || (index === 0 && imageDefault) ? "details_sideImg_img_active" : "details_sideImg_img"}
                                        style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${file.images}')`}} onClick={() => cornerImageDisplay(file.images, index)}>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="details_img_rows_container">
                        <i class={`fa-solid fa-circle-chevron-up ${imageIndex === 0 && 'right_arrow_disabled'}`} id="details_left_arrow" onClick={goImageLeft}></i>
                        <div className="details_img_container" style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${nextImageActive ? nexImage : product.image}')`}}></div>
                        <i class={`fa-solid fa-circle-chevron-up ${imageIndex === product.product_images.length - 1 && 'right_arrow_disabled'}`} id="details_right_arrow" onClick={goImageRight}></i>
                    </div>

                </div>


                <div className="details_info_sub_container">
                    <div className="details_name">
                        <p>{product.name}</p>
                    </div>
                    <div style={{height:"100px", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                        <p className="details_price">{product.price} Da</p>
                        <div style={{display: "flex", justifyContent: "space-between", width:"90%", padding: "10px", flexWrap:"wrap"}}>
                            <div style={{display: "flex"}}>
                                {[...Array(5)].map((_, index) => (
                                    <svg
                                        key={index}
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="details_product_rating_star_enable_posted"
                                    >
                                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                                    </svg>
                                ))}
                            </div>
                            <p style={{fontSize:"15px"}}>(4.5) 211 avis</p>
                        </div>
                    </div>
                    <div className="details_product_details_parent_container">
                        <p>{product.details} To start the day right, Jardin BiO étic has selected this delicious muesli made with no added sugar, a blend of 4 seeds (linseed, sunflower, sesame and pumpkin) and tasty fruits (raisins and figs).

                        High in fibre and minerals and a source of omega-3, this muesli is both delicious and nutritiou
                        Cereal flakes* 67% (rye*, wheat*, barley*, oat*, corn*)
                        </p>
                    </div>
                    <div className="details_quantity_container">
                        <button>-</button>
                        <input value={0} style={{fontSize: "20px", padding: "10px", width: "60%", height: "40px"}}/>
                        <button>+</button>
                    </div>
                    <div className="details_shopping_add_favorite_container">
                        <div className="details_shopping_add_btn">
                            <p>Ajouter au panier</p>
                            <svg class="svg-icon" viewBox="0 0 20 20">
                                <path d="M17.638,6.181h-3.844C13.581,4.273,11.963,2.786,10,2.786c-1.962,0-3.581,1.487-3.793,3.395H2.362c-0.233,0-0.424,0.191-0.424,0.424v10.184c0,0.232,0.191,0.424,0.424,0.424h15.276c0.234,0,0.425-0.191,0.425-0.424V6.605C18.062,6.372,17.872,6.181,17.638,6.181 M13.395,9.151c0.234,0,0.425,0.191,0.425,0.424S13.629,10,13.395,10c-0.232,0-0.424-0.191-0.424-0.424S13.162,9.151,13.395,9.151 M10,3.635c1.493,0,2.729,1.109,2.936,2.546H7.064C7.271,4.744,8.506,3.635,10,3.635 M6.605,9.151c0.233,0,0.424,0.191,0.424,0.424S6.838,10,6.605,10c-0.233,0-0.424-0.191-0.424-0.424S6.372,9.151,6.605,9.151 M17.214,16.365H2.786V7.029h3.395v1.347C5.687,8.552,5.332,9.021,5.332,9.575c0,0.703,0.571,1.273,1.273,1.273c0.702,0,1.273-0.57,1.273-1.273c0-0.554-0.354-1.023-0.849-1.199V7.029h5.941v1.347c-0.495,0.176-0.849,0.645-0.849,1.199c0,0.703,0.57,1.273,1.272,1.273s1.273-0.57,1.273-1.273c0-0.554-0.354-1.023-0.849-1.199V7.029h3.395V16.365z"></path>
                            </svg>
                        </div>
                        <div style={{width:"80px", height:"50px", backgroundColor:"lightseagreen", borderRadius:"5px", display:"flex", justifyContent:"center", alignItems:"center", marginLeft:"10px"}}>
                            <svg className="details_shopping_favorite_svg_icon" viewBox="0 0 20 20">
                                <path fill="none" d="M13.22,2.984c-1.125,0-2.504,0.377-3.53,1.182C8.756,3.441,7.502,2.984,6.28,2.984c-2.6,0-4.714,2.116-4.714,4.716c0,0.32,0.032,0.644,0.098,0.96c0.799,4.202,6.781,7.792,7.46,8.188c0.193,0.111,0.41,0.168,0.627,0.168c0.187,0,0.376-0.041,0.55-0.127c0.011-0.006,1.349-0.689,2.91-1.865c0.021-0.016,0.043-0.031,0.061-0.043c0.021-0.016,0.045-0.033,0.064-0.053c3.012-2.309,4.6-4.805,4.6-7.229C17.935,5.1,15.819,2.984,13.22,2.984z M12.544,13.966c-0.004,0.004-0.018,0.014-0.021,0.018s-0.018,0.012-0.023,0.016c-1.423,1.076-2.674,1.734-2.749,1.771c0,0-6.146-3.576-6.866-7.363C2.837,8.178,2.811,7.942,2.811,7.7c0-1.917,1.554-3.47,3.469-3.47c1.302,0,2.836,0.736,3.431,1.794c0.577-1.121,2.161-1.794,3.509-1.794c1.914,0,3.469,1.553,3.469,3.47C16.688,10.249,14.474,12.495,12.544,13.966z"></path>
                            </svg>
                        </div>
                    </div>
                    {/*<pre className="details_product_details">{product.details}</pre>*/}
                </div>
            </section>

            <div className="details_line_between_products_comments"></div>

            <div className="details_comments_write_reviews_button_global_container">
                <div className="details_comments_write_reviews_button_parent_container">
                    <h1 className="details_comments_title">avis & notes</h1>
                    {!havePrdComment &&
                        <button className="details_write_reviews_btn" onClick={dispRviewsForm}>laisser un avis</button>
                    }
                </div>
            </div>

            <ProductsReviews productId={id}/>

        </div>
    )
   
}


export default ProductDetails