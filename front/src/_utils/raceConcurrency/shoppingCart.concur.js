import React from "react"
import '../../styles/utils.styles/shoppingCart.concur.css'


const ShoppingCartConcur = () => {
     return (
        <div className='shopping_cart_concur_container'>
            <div className='shopping_cart_concur_deleted'>
                <p>Erreur</p>
                <p>Ce produit a été précédemment supprimé du panier</p>
                <button onClick={() => window.location.reload()}>continuer</button>
            </div>
        </div>
     )
}

export default ShoppingCartConcur