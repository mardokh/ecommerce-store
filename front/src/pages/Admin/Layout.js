import React from 'react'
import { Outlet } from 'react-router-dom';
import SideMenu from '../../components/admin/sideMenu'
import Header from '../../components/admin/Header'
import '../../styles/pages.admin/layout.css'


const Layout = () => {
    
    
    return (
        <div className='admin_layout_global'>
            <div className='admin_layout'>
                <div className='admin_side_menu'><SideMenu /></div>
                <div className='admin_sub_container'>
                    <Header />
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default Layout