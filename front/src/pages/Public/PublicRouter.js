import React from 'react'
import { Routes, Route} from 'react-router-dom'
import UserAuthGuard from '../../_utils/userAuthGuard'
import { Layout, Home, Panier, Contact, Products, Recipes, Services, ProductDetails, RecipeDetails, Favorites, InscriptionLogin, UserAccount } from '../Public'
import Error from '../../_utils/error'


const PublicRouter = () => {

    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<Home/>} />
                <Route path='/home' element={<Home/>} />
                <Route path='/contact' element={<Contact/>} />
                <Route path='/panier' element={<Panier/>} />
                <Route path='/products' element={<Products/>} />
                <Route path='/recipes' element={<Recipes/>} />
                <Route path='/services' element={<Services/>} />
                <Route path='/produit_details/:id' element={<ProductDetails/>} />
                <Route path='/recette_details/:id' element={<RecipeDetails/>} />
                <Route path='/favorites' element={<Favorites/>} />
                <Route path='/login_inscription/main/:role' element={<InscriptionLogin/>} />
                <Route path='/user/*' element={<UserAuthGuard><UserAccount/></UserAuthGuard>} />
                <Route path='*' element={<Error/>} />
            </Route>
        </Routes>
    )
}

export default PublicRouter;