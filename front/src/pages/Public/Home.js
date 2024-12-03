import React from "react"
import SlideShow from '../../components/public/SlideShow'
import Produits from '../../components/public/Products'
import Recettes from '../../components/public/Recipes'
import '../../styles/pages.public/layout.css'
import { Link } from 'react-router-dom'


const Home = () => {
    
    return (
    <div>

        {/* Banner section */}
        <div className="slides_container">
            <SlideShow />
        </div>

        {/* Products section */}
        <div className='produits_tout_voir'>
            <p>Nos Produits</p>
            <Link to="/products">
                <p>Tout voir  &gt;&gt;</p>
            </Link>
        </div>
        <section className="nutrition">
            <Produits />
        </section>

        {/* Recipes section */}
        <div className='recettes_tout_voir'>
            <p>Nos Recettes</p>
            <Link to="/recipes">
                <p>Tout voir  &gt;&gt;</p>
            </Link>
        </div>
        <section className="recettes">
            <Recettes />
        </section>

    </div>
    )
}

export default Home