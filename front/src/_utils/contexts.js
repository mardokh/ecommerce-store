// MODULES IMPORTS //
import { createContext, useState } from 'react'


// CREATE CONTEXT //
const MyContext = createContext()

// MAIN FUNCTION //
export const MyProvider = ({ children }) => {


    // Favorites products count
    const [favoritesProductsCount, setFavoritesProductsCount] = useState(0)
    const updateFavoritesProductsCount = (count) => {
        setFavoritesProductsCount(count)
    }


    // Favorites recipes count 
    const [favoritesRecipesCount, setFavoritesRecipesCount] = useState(0)
    const updateFavoritesRecipesCount = (count) => {
        setFavoritesRecipesCount(count)
    }


    // Session token
    const [sessionToken, setSessionToken] = useState(false)
    const updateSessionToken = (token) => {
        setSessionToken(token)
    }


    // Products on add
    const [productsOnAdd, setProductsOnAdd] = useState(false)
    const updateProductsOnAdd = (onAdd) => {
        setProductsOnAdd(onAdd)
    }


    // Products on edit
    const [productsOnEdit, setProductsOnEdit] = useState(false)
    const updateProductsOnEdit = (onEdit) => {
        setProductsOnEdit(onEdit)
    }


    // Shopping cart count
    const [shoppingCartCount, setShoppingCartCount] = useState(0)
    const updateShoppingCartCount = (count) => {
        setShoppingCartCount(count)
    }


    // Inscription sumbit switch
    const [sumbitSwitch, setSumbitSwitch] = useState(false)
    const updateSumbitSwitch = (switchSub) => {
        setSumbitSwitch(switchSub)
    }


    // Corner account login
    const [accountLogin, setAccountLogin] = useState(false)
    const updateAccountLogin = (login) => {
        setAccountLogin(login)
    }


    // Products reviews displaying
    const [productReviewsOnDisplay, setProductReviewsOnDisplay] = useState(false)
    const updateProductReviewsOnDisplay = (switchDisp) => {
        setProductReviewsOnDisplay(switchDisp)
    }


    // Recipes reviews displaying
    const [RecipeReviewsOnDisplay, setRecipeReviewsOnDisplay] = useState(false)
    const updateRecipeReviewsOnDisplay = (switchDisp) => {
        setRecipeReviewsOnDisplay(switchDisp)
    }


    // User have product comment
    const [userHaveProductComment, setUserHaveProductComment] = useState(false)
    const updateUserHaveProductComment = (switchDisp) => {
        setUserHaveProductComment(switchDisp)
    }


    // User have recipe comment
    const [userHaveRecipeComment, setUserHaveRecipeComment] = useState(false)
    const updateUserHaveRecipeComment = (switchDisp) => {
        setUserHaveRecipeComment(switchDisp)
    }


    return (
        <MyContext.Provider value={{

            // Favorites products count
            favoritesProductsCount, 
            updateFavoritesProductsCount,

            // Favorites recipes count
            favoritesRecipesCount, 
            updateFavoritesRecipesCount,

            // Session token
            sessionToken,
            updateSessionToken,

            // Products on add
            productsOnAdd,
            updateProductsOnAdd,

            // Products on edit
            productsOnEdit,
            updateProductsOnEdit,

            // Shopping cart count
            shoppingCartCount,
            updateShoppingCartCount,

            // Inscription sumbit switch
            sumbitSwitch,
            updateSumbitSwitch,

            // Corner account login
            accountLogin,
            updateAccountLogin,

            // Products reviews displaying
            productReviewsOnDisplay,
            updateProductReviewsOnDisplay,

            // Recipes reviews displaying
            RecipeReviewsOnDisplay,
            updateRecipeReviewsOnDisplay,

            // User have product comment
            userHaveProductComment,
            updateUserHaveProductComment,

            // User have recipe comment
            userHaveRecipeComment,
            updateUserHaveRecipeComment,
        }}>
        {children}
        </MyContext.Provider>
    )
}


// MODULES EXPORTS //
export default MyContext
