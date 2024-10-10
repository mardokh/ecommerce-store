import React from "react"
import SlideShow from '../../components/public/SlideShow'
import Produits from '../../components/public/Products'
import Recettes from '../../components/public/Recipes'
import '../../styles/pages.public/layout.css'


const Home = () => {
    
    // RENDERING //
    return (
    <div>

        {/* Banner section */}
        <div className="slides_container">
            <SlideShow />
        </div>

        {/* Products section */}
        <section className="nutrition">
            <Produits />
        </section>

        {/* Recipes section */}
        <section className="recettes">
            <Recettes />
        </section>

    </div>
    )
}

export default Home