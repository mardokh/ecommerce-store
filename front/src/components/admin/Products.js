import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'
import { productService } from '../../_services/products.service';
import Pagination from '../../pagination/Pagination';
import '../../styles/components.admin/product.css';
import CustomLoader from '../../_utils/customeLoader/customLoader'
import Kpi from "../../components/admin/KPI"


const Produits = () => {

    // STATES //
    const [products, setProducts] = useState([]);
    const [isLoad, setIsLoad] = useState(false);
    const [refNotFound, setRefNotFound] = useState(false);
    const flag = useRef(false);
    const [currentPage, setCurrentPage] = useState(1);


    // GLOBAL VARIABLES //
    let PageSize = 4;


    // NAVIGATION //
    const navigate = useNavigate()


    // MAIN LOAD PRODUCTS //
    const loadProducts = () => {
        if (flag.current === false) {
            productService.getAllproducts()
                .then(res => {            
                    setProducts(res.data.data)
                    setRefNotFound(false)
                    setIsLoad(true)
                })
                .catch(err => handleError(err));
        }
        return () => flag.current = true;
    }

    
    // LOAD PRODUCTS ON PAGE LOAD //
    useEffect(() => {
        loadProducts()
    },[])


    // LOAD PRODUCTS ERRORS HANDLE //
    const handleError = (err) => {
        if (err.response && err.response.status) {
            setRefNotFound(true);
            setProducts(err.response.data.data);
            setIsLoad(true);
        } else {
            console.log('Error:', err.message);
        }
    };


    // DELETE AN PRODUCT //
    const deleteProduct = async (productId) => {
        try {
            await productService.deleteProduct(productId)
            const productsGet = await productService.getAllproducts()
            setProducts(productsGet.data.data)
        } catch (err) {
            handleError(err)
        }
    }
    

    // PAGINATION HANDLE 
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize
        const lastPageIndex = firstPageIndex + PageSize
        return products.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, products])


    useEffect(() => {
        if (currentTableData.length === 0 && currentPage > 1) {
            const curpage = currentPage
            setCurrentPage(curpage - 1)
        }
    })


    // EDIT PRODUCT PAGE REDIRECTION //
    const displayProductEditForm = (productId) => {
        navigate(`../edit_produt/${productId}`)
    }
    

    // AWAIT LOADER //
    if (!isLoad) {
        return <CustomLoader/>
    }


    // RENDERING //
    return (
        <div className='product_manage_global_container'>
            <div className='product_manage_kpi_container'><Kpi/></div>
            <div className='product_manage_sub_container'>
                <div className='product_manage_container'>
                    <table className='product_manage_table_container'>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Note</th>
                                <th>Favorites</th>
                                <th>CreatedAt</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!refNotFound ? (
                                currentTableData.map(product => (
                                    <tr key={product.id}>
                                        <td className='product_manage_img_container' style={{backgroundImage: `url('${process.env.REACT_APP_REMOTE_URL}/uploads/${product.image}')`}}></td>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td>{product.note}</td>
                                        <td>{product.favprd}</td>
                                        <td>{product.createdAt}</td>
                                        <td className='product_manage manage_icons'>
                                            <button className='product_manage_btn_edit' onClick={() => displayProductEditForm(product.id)}>Edit</button>
                                            <button className='product_manage_btn_delete'  onClick={() => deleteProduct(product.id)}>Delete</button>
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
                    <Pagination
                        className="pagination-bar"
                        currentTableData={currentTableData}
                        currentPage={currentPage}
                        totalCount={products.length}
                        pageSize={PageSize}
                        onPageChange={page => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Produits;