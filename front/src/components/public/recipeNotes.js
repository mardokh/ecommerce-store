// MODULES IMPORTS //
import React, {useContext, useState} from "react"
import "../../styles/components.public/recipes_notes.css"
import MyContext from "../../_utils/contexts"
import { recipeNoteService } from "../../_services/recipeNote.service"


const RecipeNotes = () => {

    // STATES //
    const { recipesNotesId } = useContext(MyContext)
    const { updateRecipesNotesDisplay } = useContext(MyContext)
    const [note, setNote] = useState(1)


    // SUBMIT FORM //
    const subNotesFrom = (e) => {
        e.preventDefault()

        try {
            const formData = new FormData()
            formData.append('id', recipesNotesId)
            formData.append('note', note)

            console.log(formData.get('id'))
            console.log(formData.get('note'))

            // Api call
            recipeNoteService.recipeNotesAdd(formData)
                .then(res => {
                    // console.log(res)
                    updateRecipesNotesDisplay(false)
                })
                .catch(err => console.error('Error: ', err))

        }
        catch (err) {
            console.error('Error :', err)
        }
    }

    // HANDLE INPUTS //
    const handlInputChange = (value) => {
        setNote(value)
    }

    // CLOSE NOTE FROM //
    const closeNoteForm = () => {
        updateRecipesNotesDisplay(false)
    }



    return (
        <div className="recipes_notes_container">
            <i class="fa-solid fa-rectangle-xmark" onClick={closeNoteForm}></i>
            <form className="recipes_notes_form_container" onSubmit={subNotesFrom}>
                <label>Note sur /5</label>
                <div>
                    <i className="fa-solid fa-star" style={{color: 'gold'}}></i>
                    <i className="fa-solid fa-star" style={{color: 'gold'}}></i>
                    <i className="fa-solid fa-star" style={{color: 'gold'}}></i>
                    <i className="fa-solid fa-star" style={{color: 'gold'}}></i>
                    <i className="fa-solid fa-star" style={{color: 'gold'}}></i>
                </div>
                <input className="input_recipe_notes" type="number" name="note" max="5" min="1" onChange={(e) => handlInputChange(e.target.value)}/>
                <input className='btn_recipes_notes' type='submit' value="soumettre"/>
            </form>
        </div>
    )
}



// MODULES EXPORTS //
export default RecipeNotes