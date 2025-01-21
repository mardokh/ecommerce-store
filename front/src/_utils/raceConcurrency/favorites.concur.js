import React from "react"
import '../../styles/utils.styles/favorites.concur.css'


const FavoritesConcur = ({exist, deleted}) => {

     return (
        <div className='favorites_concur_container'>
            {exist ? (
                <div className='favorites_concur_exist'>
                    <p>Erreur</p>
                    <p>Ce produit exist deja dans les favoris</p>
                    <button onClick={() => window.location.reload()}>continuer</button>
                </div>
            ):deleted &&
                <div className='favorites_concur_deleted'>
                    <p>Erreur</p>
                    <p>Ce produit a été précédemment supprimé des favoris</p>
                    <button onClick={() => window.location.reload()}>continuer</button>
                </div>
            }
        </div>
     )
}


export default FavoritesConcur