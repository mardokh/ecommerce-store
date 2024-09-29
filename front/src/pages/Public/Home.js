import React, {useContext} from "react"
import SlideShow from '../../components/public/SlideShow'
import Produits from '../../components/public/Produits'
import Recettes from '../../components/public/Recettes'
//import ProductNotes from '../../components/public/productNotes'
import RecipeNotes from '../../components/public/recipeNotes'
import '../../styles/pages.public/layout.css'
import MyContext from "../../_utils/contexts"


const Home = () => {

    // STATES //
    const { productsNotesDisplay } = useContext(MyContext)
    const { recipesNotesDisplay } = useContext(MyContext)


    // RENDERING //
    return (
    <div>

        {/* Banner produits */}
        <div className="slides_container">
            <SlideShow />
        </div>

        {/* Products notes */}
        {productsNotesDisplay &&
        <div className="container_products_notes">
            {/*ProductNotes }*/}
        </div>
        }

        {/* Recipes notes */}
        {recipesNotesDisplay &&
        <div className="container_recipes_notes">
            <RecipeNotes />
        </div>
        }

        {/* Section produits */}
        <section className="nutrition">
            <Produits />
        </section>

        {/* Section recettes */}
        <section className="recettes">
            <Recettes />
        </section>

    </div>
    )
}

export default Home