import React, {useState, useEffect} from 'react'
import '../../styles/components.admin/categories.css'
import { categoriesService } from '../../_services/categories.service'
import CustomLoader from '../../_utils/customeLoader/customLoader'


const Categories = () => {

    // STATES //
    const [categoriesNames, setcategoriesNames] = useState([])
    const [notFound, setNotFound] = useState(false)
    const [onSubmiting, setOnSubmiting] = useState(false)
    const [onLoading, setOnLoading] = useState(false)
    const [onFormOpen, setOnFormOpen] = useState(false)
    const [newCategory, setNewCategory] = useState("")
    const [forbidDelete, setForbidDelete] = useState("")
    const [categId, setCategId] = useState(null)
    const [onCategDeleteOpen, setOnCategDeleteOpen] = useState(false)
    const [onCategDeleted, setOnCategDeleted] = useState(false)


    const getCategoriesNames = async () => {
        try {
            const categNames = await categoriesService.categoriesNamesGet()
            setcategoriesNames([...categNames.data.data])
        }
        catch (err) {
            setNotFound(true)
            console.error(err)
        }
    }


    const submitForm = async (e) => {
        e.preventDefault()
        setOnLoading(true)
        try {
            await categoriesService.categorieCreate(newCategory)
            setOnLoading(false)
            setOnSubmiting(true)
            getCategoriesNames()
            setTimeout(() => setOnFormOpen(false), 500)
        }
        catch (err) {
            console.error(err)
        }
    }
    

    // CATEGORY INPUT HANDLER //
    const categInputValue = (newCateg) => {
        setNewCategory(newCateg)
    }


    // ON DELETE CATEGORY //
    const openDeleteCateg = (categoryId) => {
        setOnCategDeleteOpen(true)
        setCategId(categoryId)
    }


    // CLOSE DELETE CATEGORY //
    const closeCategDelete = () => {
        setOnCategDeleteOpen(false)
        setForbidDelete("")
    }


    // CLOSE CATEGORY ADD //
    const closeCategAdd = () => {
        setOnFormOpen(false)
    }


    // DELTE CATEGORY //
    const deleteCategory = async () => {
        setOnLoading(true)
        try {
            await categoriesService.categoryDelete(categId)
            setOnLoading(false)
            setOnCategDeleted(true)
            getCategoriesNames()
            setTimeout(() => setOnCategDeleteOpen(false), 500)
        }
        catch (err) {
            if (err.response?.status === 400) {
                setForbidDelete(err.response.data.message)
                setOnLoading(false)
            } else {
                console.error(err)
            }
        }
    }


    // Get categories names
    useEffect(() => {
        getCategoriesNames()
    }, [])

    
    const openForm = () => {
        setOnFormOpen(true)
    }
    

    // RENDERING //
    return (
        <div className='categories_manage_global_container'>
            {onFormOpen &&
                <div className='categories_manage_load_submit_global_container'>
                    <div className='categories_manage_load_submit_container'>
                        <svg class="categories_manage_icon categories_manage_close_icon" onClick={closeCategAdd} viewBox="0 0 20 20">
							<path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
						</svg>
                        {onLoading ? (
                            <div className='categories_manage_loader_spin'>
                                <CustomLoader />
                            </div>
                        )
                        : onSubmiting ? (
                            <div className='categories_manage_success_container'>
                                <svg className="categories_manage_icon categories_manage_success_icon" viewBox="0 0 20 20">
                                    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                                </svg>
                                <p>category add successfuly</p>
                            </div>
                        )
                        : (
                            <form className='categories_manage_categ_form_container' onSubmit={submitForm}>
                                <input className='categories_manage_categ_input' placeholder='Enter a new category' type='text' onChange={(e) => categInputValue(e.target.value)}/>
                                <button className='categories_manage_categ_btn'>save</button>
                            </form>
                        )
                        } 
                    </div>
                </div>
            }
            {onCategDeleteOpen &&
                <div className='categories_manage_load_submit_global_container'>
                    <div className='categories_manage_load_submit_container'>
                        {onLoading ? (
                            <div className='categories_manage_loader_spin'>
                                <CustomLoader />
                            </div>
                        )
                        : onCategDeleted ? (
                            <div className='categories_manage_success_container'>
                                <svg className="categories_manage_icon categories_manage_success_icon" viewBox="0 0 20 20">
                                    <path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
                                </svg>
                                <p>category deleted successfuly</p>
                            </div>
                        )
                        : (
                            <div className='categories_manage_categ_delete_container'>
                                <div className='categories_manage_categ_delete_btn_container'>
                                    <p className='categories_manage_categ_delete_btn_msg'>Pour etre supprimer la categories ne doit pas appartenir a un produit</p>
                                    <div>
                                        <button className='categories_manage_categ_delete_btn' onClick={deleteCategory}>confirm</button>
                                        <button className='categories_manage_categ_delete_btn' onClick={closeCategDelete}>cancel</button>
                                    </div>
                                </div>
                                {forbidDelete.length > 0 && <p className='categories_manage_forbid_delete'>{forbidDelete}</p>}
                            </div>
                        )
                        } 
                    </div>
                </div>
            }
            <div className='categories_manage_sub_container'>
                <div className='categories_manage_categ_add_btn_container'>
                    <button className='categories_manage_categ_add_btn' onClick={openForm}>add</button>
                </div>
                <div className='categories_manage_container'>
                    <table className='categories_manage_table_container'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Products count</th>
                                <th>CreatedAt</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!notFound ? (
                                categoriesNames.map(category => (
                                    <tr key={category.id}>
                                        <td>{category.name}</td>
                                        <td>{category.productCount || 0}</td>
                                        <td>{category.createdAt}</td>
                                        <td className='categories_manage_icons_container manage_icons'>
                                            <svg class="svg-icon" viewBox="0 0 20 20">
                                                <path d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"></path>
                                            </svg>
                                            <svg class="svg-icon" viewBox="0 0 20 20" onClick={() => openDeleteCateg(category.id)}>
                                                <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
                                            </svg>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7">No products found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        );
};


export default Categories;