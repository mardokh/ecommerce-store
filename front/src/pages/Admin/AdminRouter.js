import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, ProductsManage, AddProdut, EditProdut, CommandesManage, RecipeManage, AddReipe, EditRecipe, LoginRegister } from '../Admin'
import Error from '../../_utils/error' 


const AdminRouter = () => {
    
    return (
        <Routes>
            <Route element={<Layout/>}>
                <Route index element={<ProductsManage/>} />
                <Route path='/products_manage' element={<ProductsManage/>} />
                <Route path='/add_product' element={<AddProdut/>} />
                <Route path='/edit_produt/:id' element={<EditProdut/>} />
                <Route path='/commandes_manage' element={<CommandesManage/>} />
                <Route path='/recipes_manage' element={<RecipeManage/>} />
                <Route path='/add_recipe' element={<AddReipe/>} />
                <Route path='/edit_recipe/:id' element={<EditRecipe/>} />
                <Route path='/login_register' element={<LoginRegister/>} />
                <Route path='*' element={<Error/>} />
            </Route>
        </Routes>
    )
}


export default AdminRouter