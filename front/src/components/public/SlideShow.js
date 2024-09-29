import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import whiteTable from '../../images/white-table.jpg'
import '../../styles/components.public/slidershow.css';

const SlideShow = () => {

    return (
        <>
            <div className='slide fade'>
                <div style={{backgroundImage:`url(${whiteTable})`}} className='image_slides'>
                    <p>Le meilleur du bio pour la meilleur des santee</p>
                </div>
            </div>
        </>
    )
}

export default SlideShow;
