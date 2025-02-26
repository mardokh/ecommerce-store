import React from 'react'
import '../../styles/components.admin/categories.css'


const Categories = () => {

// RENDERING //
return (
    <div className='categories_manage_global_container'>
        <div className='categories_manage_sub_container'>
            <div className='categories_manage_container'>
                <table className='categories_manage_table_container'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Number of products</th>
                            <th>CreatedAt</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Shocolat</td>
                            <td>25</td>
                            <td>02/05/2025</td>
                            <td className='categories_manage manage_icons'>
                                <button className='categories_manage_btn_edit'>Edit</button>
                                <button className='categories_manage_btn_delete'>Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    );
};


export default Categories;