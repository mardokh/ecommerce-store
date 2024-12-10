import React, {useEffect, useState, useRef} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../styles/components.public/header.css'
import logo from '../../images/logo.png'
import Cookies from 'js-cookie'
import { searchBarService } from '../../_services/searchBar.service'
import { UserService } from '../../_services/user.service'
import CornerAccount from '../../pages/User/cornerAccount'
import CustomLoader from '../../_utils/customeLoader/customLoader'
import { useSelector } from 'react-redux'


const Header = () => {

    // STATES //
    const [research, setResearch] = useState()
    const [searchActive, setSearchActive] = useState(false)
    const [userOptionsDisp, setuserOptionsDisp] = useState(false)
    const [isLoad, setISload] = useState(false)
    const [isLogout, setIsLogout] = useState(true)


    // REDUX //
    const favPrdcount = useSelector((state) => state.favPrdCount.count)
    const favRcpcount = useSelector((state) => state.favRcpCount.count)
    const favCartcount = useSelector((state) => state.favCartCount.count)
    


    // REFERENCES //
    const userOptionsRef = useRef(null)


    // REDIRECTION //
    const navigate = useNavigate()


    // SERACH BAR HANDLE //
    const searchGet = (searchTerm) => {
        if (searchTerm.trim() !== "") {
            searchBarService.searchBar(searchTerm)
                .then(res => {
                    setResearch(res.data.data)
                    setSearchActive(true)
                })
                .catch(err => console.error('Error : ', err))
        } else {
            setResearch(null)
            setSearchActive(false)
        }
    }


    // REDIRECT TO ITEM DETAILS //
    const redirection = (itemId) => {
        navigate(`/produit_details/${itemId}`)
        navigate(0)
        setSearchActive(false)
    }


    // REDIRECT TO USER INSCRIPTION //
    const inscriptionFormdisplay = () => {
        setuserOptionsDisp(false)
        navigate('/sing_up')
    }


    // OPEN/CLOSE USER OPTION //
    const userOptions = () => {
        setuserOptionsDisp(!userOptionsDisp)
    }


    // REDIRECT TO USER CONNECTION //
    const connectionFormDisp = () => {
        setuserOptionsDisp(false)
        navigate('/sing_in')
    }


    // GET USER LOGIN COOKIE //
    const loginUserId = Cookies.get('userId')


    // SET CORNER ACCOUNT CONNECTED FUNCTION
    const cornerAccountConnected = async () => {
        try {
            // Check login cookie
            if (loginUserId) {

                setIsLogout(false)

                 // Check token validity
                const res = await UserService.isLogged()
                
                // Set loader
                setISload(true)
            }
        }
        catch (err) {
            console.error('Error :', err)
        }
    }


    // SET CORNER ACCOUNT ONLOAD
    useEffect(() => {
        cornerAccountConnected()
    }, [loginUserId])


    // USER OPTIONS CLICK EVENT HANDLING //
    const handleClickOutside = (event) => {
        if (userOptionsRef.current && !userOptionsRef.current.contains(event.target)) {
            setuserOptionsDisp(false)
        }
    }
    useEffect(() => {
        document.addEventListener("click", handleClickOutside);

        return () => {
        document.removeEventListener("click", handleClickOutside);
        }
    }, [])


    // REDIRECT TO USER ACCOUNT //
    const redirectToAccount = () => {
        setuserOptionsDisp(false)
        navigate(`/user/account/${loginUserId}`)
    }

    
    // LOGOUT //
    const userLogout = () => {
        UserService.logout()
        Cookies.remove('userId')
        window.location.reload()
    }


    return (
        <div className='header_global_parent'>
            <header>
                <nav>
                    <ul>
                        <div className='header_burger_menu_container'>
                            <div className='header_burger_menu_item'></div>
                            <div className='header_burger_menu_item'></div>
                            <div className='header_burger_menu_item'></div>
                        </div>
                        <li><img src={logo} className='logo'/></li>
                        <div className='angles'>
                            <li className="home">
                                <Link to="/home">Acceuil</Link>
                            </li>
                            <li className="produits">
                                <Link to="/products">Produits</Link>
                            </li>
                            <li className="services">
                                <Link to="/recipes">Recettes</Link>
                            </li>
                            <li className="services">
                                <Link to="/services">Services</Link>
                            </li>
                        </div>
                        <li className='search_barre'>
                            <input placeholder='recherche'onChange={(e) => searchGet(e.target.value)}/>
                            <i class="fa-solid fa-magnifying-glass"/>
                            <div className='serachBar_result_container'>
                                {searchActive &&
                                    research.map(search => (
                                        <div key={search.id}>                                      
                                            <div className='searchBar_item_container' onClick={() => redirection(search.id)}>
                                                <div className='searchBar_item_image' style={{backgroundImage: `url('http://${process.env.REACT_APP_REMOTE_ADDR}:${process.env.REACT_APP_SERVER_PORT}/uploads/${search.image}')`}}></div>
                                                <p>{search.name}</p>
                                            </div>                                       
                                        </div>
                                    ))
                                }
                            </div>
                        </li>
                        <div className='header_features_icons_container'>
                            <div className='shopping_cart_icon_container'>
                                <Link to="/panier">
                                    <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50.000000 50.000000" preserveAspectRatio="xMidYMid meet">
                                        <g transform="translate(0.000000,50.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
                                            <path d="M185 460 c-3 -5 -31 -10 -60 -10 -61 0 -70 -8 -81 -79 -4 -26 -14 -46 -26 -52 -13 -7 -18 -19 -16 -37 l3 -27 245 0 245 0 3 27 c2 18 -3 30 -16 37 -12 6 -22 26 -26 52 -11 71 -20 79 -81 79 -29 0 -57 5 -60 10 -3 6 -33 10 -65 10 -32 0 -62 -4 -65 -10z m120 -20 c3 -5 30 -10 60 -10 l54 0 11 -42 c6 -24 13 -49 15 -55 3 -10 -40 -13 -195 -13 -155 0 -198 3 -195 13 2 6 9 31 15 55 l11 42 54 0 c30 0 57 5 60 10 3 6 28 10 55 10 27 0 52 -4 55 -10z"/>
                                            <path d="M30 224 c0 -3 12 -45 27 -95 l27 -89 166 0 166 0 27 89 c15 50 27 92 27 95 0 4 -99 6 -220 6 -121 0 -220 -2 -220 -6z m150 -89 c0 -37 -4 -65 -10 -65 -6 0 -10 28 -10 65 0 37 4 65 10 65 6 0 10 -28 10 -65z m80 0 c0 -37 -4 -65 -10 -65 -6 0 -10 28 -10 65 0 37 4 65 10 65 6 0 10 -28 10 -65z m80 0 c0 -37 -4 -65 -10 -65 -6 0 -10 28 -10 65 0 37 4 65 10 65 6 0 10 -28 10 -65z m-220 13 c0 -48 -16 -42 -26 10 -5 25 -3 32 10 32 12 0 16 -10 16 -42z m286 10 c-10 -52 -26 -58 -26 -10 0 32 4 42 16 42 13 0 15 -7 10 -32z"/>
                                        </g>
                                    </svg>
                                </Link>
                                <span style={{display: favCartcount === 0 ? 'none' : 'initial'}} className='shopping_cart_icon_count'>{favCartcount}</span>
                            </div>
                            <div className='favorites_products_icon'>
                                <Link to="/favorites">
                                    <svg width="30px" height="30px" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5ZM4.14635 5.14648C4.8939 4.39893 6.10591 4.39893 6.85346 5.14648L7.49991 5.79292L8.14635 5.14648C8.8939 4.39893 10.1059 4.39893 10.8535 5.14648C11.601 5.89402 11.601 7.10603 10.8535 7.85358L7.49991 11.2071L4.14635 7.85358C3.39881 7.10604 3.39881 5.89402 4.14635 5.14648Z" fill="#000000"/>
                                    </svg>
                                </Link> 
                                <span style={{display: (favPrdcount + favRcpcount === 0) ? 'none' : 'initial'}} className='favorites_products_count'>{favPrdcount + favRcpcount}</span>
                            </div>
                            <div className='user_account_icon_container' ref={userOptionsRef}>
                                <svg width="35px" height="35px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={userOptions}>
                                    <rect width="24" height="24" fill="white"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.9999 6C9.79077 6 7.99991 7.79086 7.99991 10C7.99991 12.2091 9.79077 14 11.9999 14C14.209 14 15.9999 12.2091 15.9999 10C15.9999 7.79086 14.209 6 11.9999 6ZM17.1115 15.9974C17.8693 16.4854 17.8323 17.5491 17.1422 18.1288C15.7517 19.2966 13.9581 20 12.0001 20C10.0551 20 8.27215 19.3059 6.88556 18.1518C6.18931 17.5723 6.15242 16.5032 6.91351 16.012C7.15044 15.8591 7.40846 15.7251 7.68849 15.6097C8.81516 15.1452 10.2542 15 12 15C13.7546 15 15.2018 15.1359 16.3314 15.5954C16.6136 15.7102 16.8734 15.8441 17.1115 15.9974Z" fill="black"/>
                                </svg>
                                    {userOptionsDisp &&
                                        <div className='user_options_container'>
                                            { isLogout ? (
                                                <div className='user_options_sub_container'>
                                                    <button onClick={connectionFormDisp}>Se connecter</button>
                                                    <button onClick={inscriptionFormdisplay}>S'inscrire</button>
                                                </div>
                                            ): !isLoad ? (
                                                <CustomLoader/>
                                            ):
                                            <div className='cornerAccount_account_container'>
                                                <CornerAccount/>
                                                <div id="cornerAccount_btn_container">
                                                    <button onClick={redirectToAccount}>mon compte</button>
                                                    <button onClick={userLogout}>deconnexion</button>
                                                </div>
                                            </div>
                                            }
                                        </div>
                                    }
                            </div>
                        </div>
                    </ul>
                </nav>
            </header>
        </div>
    )
}


export default Header