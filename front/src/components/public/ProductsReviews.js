import React, { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "../../styles/components.public/productsReviews.css"
import { productsReviewsService } from "../../_services/productsReviews.service"
import Cookies from 'js-cookie'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { UserService } from "../../_services/user.service"
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { updatePrdReveiwDisplay } from '../../redux/reducers/prdReveiwDisplaySlice'
import { updateHavePrdComment } from '../../redux/reducers/havePrdCommentSlice'


const ProductsReviews = ({ productId }) => {

    // STATES //
    const [isLoad, setISload] = useState(false)
    const [rating, setRating] = useState(0)
    const [prodId, setProdId] = useState(0)
    const [commentClone, setComment] = useState("")
    const [reviewData, setReviewData] = useState([])
    const [reviewNoteFoundMessage, setReviewNoteFoundMessage] = useState("")
    const [userConnected, setUserConnected] = useState(false)
    const [user, setUser] = useState({})
    const [commentEdit, setCommentEdit] = useState(false)
    const [editCommentId, setEditCommentId] = useState(null) // New state to track the comment being edited
    const [submitLoader, setSubmitLoader] = useState(false)
    

    // REDUX //
    const dispatch = useDispatch()
    const prdReveiwdisplay = useSelector((state) => state.prdReveiwDisplay.status)


    // GET LOGIN COOKIE //
    const user_id = Cookies.get('userId')


    // REFERENCES //
    const parentNodeRef = useRef(null)


    // REVIEWS FORM SUBMIT //
    const submitForm = async (e) => {
        e.preventDefault()
        setSubmitLoader(true)

        try {
            // Create a new review object
            const newReview = {
                user_name: user.firstName + " " + user.lastName,
                user_id: parseInt(user_id),
                product_id: parseInt(productId),
                note: rating,
                comment: commentClone
            };

            // Send form to endPoint
            await productsReviewsService.addProductReview(newReview)

            // Reset form fields
            setRating(0)
            setComment("")

            getCommentsNotes()

            // Close component
            dispatch(updatePrdReveiwDisplay({status: false}))

            // Set loader
            setSubmitLoader(true)

        } catch (err) {
            console.error('Error', err)
        }
    }


    // REVIEWS EDIT FORM SUBMIT //
    const submitEditForm = async (e) => {
        e.preventDefault()
        setSubmitLoader(true)
        
        try {
            // Create a new review object
            const newReview = {
                user_id: user_id,
                product_id: prodId,
                note: rating,
                comment: commentClone
            }

            // Send form to endPoint
            await productsReviewsService.updateProductReview(newReview)

            // Reset form fields
            setRating(0)
            setComment("")
            setEditCommentId(null) // Reset edit comment ID

            getCommentsNotes()

            // Close component
            dispatch(updatePrdReveiwDisplay({status: false}))

        } catch (err) {
            console.error('Error', err)
        }
    }


    // GET REVIEWS ERRORS HANDLING //
    const handleError = (err) => {
        if (err.response && err.response.status === 404) {
            setReviewData([])
            setReviewNoteFoundMessage(err.response.data.message)
            setISload(true)
        }
        else {
            console.log('Error:', err)
        }
    }


    // CHECK USER TOKEN / GET USER DATA //
    useEffect(() => {
        const getUserData = async () => {
            try {
                // Check if login cookie exist
                if (user_id) {
                    // Check token validity
                    const res = await UserService.isLogged()

                    // Get user
                    if (res === true) {
                        const userData = await UserService.getUser(user_id)

                        // Update state
                        setUser(userData.data.data)

                        // Update user connecting status
                        setUserConnected(true)
                    }
                }
            } catch (err) {
                console.error('getUserData Error :', err)
            }
        };
        getUserData()
    }, [])


    const getCommentsNotes = async () => {
        try {
            // Get all comments
            const res = await productsReviewsService.getProductReview(productId)
    
            // Update state
            const formattedData = res.data.data.map(item => {
                const comments = item.productsReviews.map(subItem => ({
                    id: subItem.id,
                    user_name: `${subItem.user_profil.firstName} ${subItem.user_profil.lastName}`,
                    user_id: subItem.user_id,
                    product_id: subItem.product_id,
                    note: subItem.note,
                    comment: subItem.comment,
                }));
    
                const levels = item.ProductsNotesLevels[0] || {}
    
                return {
                    comments,
                    totale_note: levels.totale_note,
                    level_1: levels.level_1 || 0,
                    level_2: levels.level_2 || 0,
                    level_3: levels.level_3 || 0,
                    level_4: levels.level_4 || 0,
                    level_5: levels.level_5 || 0,
                }
            })
    
            setReviewData(formattedData)
            setISload(true)
    
        } catch (err) {
            handleError(err)
        }
    }
    

    // GET ALL REVIEWS //
    useEffect(() => {
        getCommentsNotes()
    }, [])
    

    // CHECK IF USER HAVE COMMENT //
    useEffect(() => {
        const checkUserComment = () => {
            try {
                if (reviewData.some(item => item.comments.some(comment => comment.user_id == user_id))) {
                    dispatch(updateHavePrdComment({status: true}))
                } else {
                    dispatch(updateHavePrdComment({status: false}))
                }
            } catch (err) {
                console.error('checkUserComment Error : ', err)
            }
        };
        checkUserComment()
    }, [reviewData, userConnected])


    // COMMENT INPUT HANDLING //
    const inputChange = (comment) => {
        setComment(comment)
    }


    // RATING INPUT HANDLING //
    const handleStarClick = (index) => {
        setRating(index + 1)
    }


    // DELETE REVIEW HANDLING //
    const deleteReview = async (reviewId, userId, productId) => {
        try {
            // Delete review from the server
            const productsReview = await productsReviewsService.deleteProductReview(reviewId, userId, productId)

            if (productsReview.status && productsReview.status === 204) {
                await getCommentsNotes()
            }

        } catch (err) {
            console.error('deleteReview Error:', err)
        }
    }


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (parentNodeRef.current && !parentNodeRef.current.contains(event.target)) {
                dispatch(updatePrdReveiwDisplay({status: false}))
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [prdReveiwdisplay])


    // COMMENT EDIT HANDLING //
    const editReview = (commentId, commentText, commentRating, product_id) => {
        setCommentEdit(true)
        setEditCommentId(commentId) // Set the comment being edited
        setComment(commentText) // Initialize the comment state with the current comment
        setRating(commentRating) // Initialize the rating state with the current rating
        setProdId(product_id)
        dispatch(updatePrdReveiwDisplay({status: true}))
    }
    

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
         const halfStar = rating % 1 > 0
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)
    
        return (
            <div className="details_rating_star_container">
                {[...Array(fullStars)].map((_, index) => (
                    <svg key={index} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="details_rating_star_enable">
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
                    <svg key={index} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="details_rating_star_disable">
                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                    </svg>
                ))}
            </div>
        )
    }
    

    // LOADER //
    if (!isLoad) {
        return <CustomLoader />
    }
    
    return (
        <div>
            <div className="details_comment_and_notes_totale">
                {reviewData.map((item, index) => (
                    <div className="details_comment_and_notes_totale_sub_container" key={index}>
                        {item.totale_note && <p style={{ fontSize: '25px' }}>{item.totale_note}</p>}
                        {renderStars(item.totale_note)}
                        {item.totale_note && (
                            <>
                                {[1, 2, 3, 4, 5].map(level => (
                                    <div className="details_comment_and_notes_percentage_item_container" key={level}>
                                        <p className="details_comment_and_notes_level">{level}</p>
                                        <div className="details_comment_and_notes_percentage_item_sub_container">
                                            <div className="details_comment_and_notes_percentage_item_bar"
                                                style={{
                                                    width: `${item[`level_${level}`]}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="details_comment_and_notes_percentage_level">{item[`level_${level}`]} %</p>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                ))}
            </div>
            {prdReveiwdisplay &&
                <section className="details_comment_and_notes_global_container">
                    <div className="details_comment_and_notes_parent_container" ref={parentNodeRef}>
                        {submitLoader ?
                            <CustomLoader />
                            :
                            <div className="details_comment_and_notes_sub_parent_container">
                                {userConnected && !commentEdit ?
                                    <div className="details_comment_and_notes_container">
                                        <div className="details_comment_and_notes_sub_container">
                                            <div className="details_comments_global_container">
                                                <section className="details_comments_container">
                                                    <form className="details_form_container" onSubmit={submitForm}>
                                                        <div className="details_rating_container">
                                                            <p>Laisser une note pour ce produit</p>
                                                            <div className="details_rating_star_container">
                                                                {[...Array(5)].map((_, index) => (
                                                                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" key={index} className={index < rating ? "details_rating_star details_rating_filled" : "details_rating_star"} onClick={() => handleStarClick(index)}>
                                                                        <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                                                                    </svg>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div className="details_form_your_comment">
                                                            <label>Votre commentaire</label>
                                                            <textarea onChange={(e) => inputChange(e.target.value)} value={commentClone}></textarea>
                                                        </div>
                                                        <div className="details_form_button_send">
                                                            <input type="submit" value="Poster" />
                                                        </div>
                                                    </form>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                    : commentEdit ?
                                        <div className="details_comment_and_notes_container">
                                            {reviewData.map(item =>
                                                item.comments.map(comment => {
                                                    if (comment.user_id == user_id && comment.id === editCommentId) {
                                                        return (
                                                            <div className="details_comment_and_notes_container" key={comment.id}>
                                                                <div className="details_comment_and_notes_sub_container">
                                                                    <div className="details_comments_global_container">
                                                                        <section className="details_comments_container">
                                                                            <form className="details_form_container" onSubmit={submitEditForm}>
                                                                                <div className="details_rating_container">
                                                                                    <div className="details_rating_star_container">
                                                                                        {[...Array(5)].map((_, index) => (
                                                                                            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" key={index} className={index < rating ? "details_rating_star details_rating_filled" : "details_rating_star"} onClick={() => handleStarClick(index)}>
                                                                                                <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                                                                                            </svg>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="details_form_your_comment">
                                                                                    <label>Votre commentaire</label>
                                                                                    <textarea onChange={(e) => inputChange(e.target.value)} value={commentClone}></textarea>
                                                                                </div>
                                                                                <div className="details_form_button_send">
                                                                                    <input type="submit" value="Poster" />
                                                                                </div>
                                                                            </form>
                                                                        </section>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                })
                                            )}
                                        </div>
                                        :
                                        <div className="details_form_not_connected_container">
                                            <p>Veuillez vous <Link to="/login_inscription/main/connexion">connecter</Link> ou vous <Link to="/login_inscription/main/connexion">inscrire</Link> pour laisser votre avis</p>
                                        </div>
                                }
                            </div>
                        }
                    </div>
                </section>
            }
            <section className="details_reviews_container">
                {reviewData.length > 0 ?
                    (
                        <div>
                            {reviewData.map(item =>
                                item.comments.map(comment => (
                                    <div className="details_reviews_item" key={comment.id}>
                                        <div className="details_reviews_item_sub_container">
                                            <div>
                                                <p className="details_reviews_name">{comment.user_name}</p>
                                                <div>
                                                    {[...Array(5)].map((_, index) => (
                                                        <svg
                                                            key={index}
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className={comment.note >= index + 1 ? "details_rating_star_enable_posted" : "details_rating_star_disable_posted"}
                                                        >
                                                            <polygon points="12,2 15,8.5 22,9 17,13.5 18.5,21 12,17 5.5,21 7,13.5 2,9 9,8.5" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                            <p>{comment.comment}</p>
                                        </div>
                                        {comment.user_id == user_id &&
                                            <div className="details_reviews_icons_container">
                                                <svg className="details_reviews_icon" viewBox="0 0 20 20" onClick={() => editReview(comment.id, comment.comment, comment.note, comment.product_id)}>
                                                    <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
                                                </svg>
                                                <svg className="details_reviews_icon" viewBox="0 0 20 20" onClick={() => deleteReview(comment.id, comment.user_id, comment.product_id)}>
                                                    <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                                                </svg>
                                            </div>
                                        }
                                    </div>
                                ))
                            )}
                        </div>
                    )
                    : 
                    (
                        <div className="details_reviews_no_comment">
                            <p>{reviewNoteFoundMessage}</p>
                        </div>
                    )
                }
            </section>
        </div>
    );
};

export default ProductsReviews