import { useState } from 'react'
import { useNavigate, useParams } from "react-router";
import * as termService from '../../services/termService'
import 'mathlive';
const category = {
    'Algebra': '➗',
    'Geometry': '📐',
    'Calculus': '∫',
    'Statistics': '📊',
    'Probability': '🎲',
    'Trigonometry': '📐',
    'Linear Algebra': '🧮',
    'Number Theory': '🔢',
    'Discrete Math': '🧩'
}

function TermForm(props) {
    const { addTerm, termToUpdate, updateOneTerm }=props
    const navigate = useNavigate()

    const [formState, setFormState] = useState(termToUpdate ? termToUpdate : {
        name: "",
        definition: '',
        example: '',
        category: ''
    })

    const handleChange = (evt) => {
        setFormState({ ...formState, [evt.target.name]: evt.target.value })
    }

    const handleSubmit = async (evt) => {
        evt.preventDefault()
        try {
            if (termToUpdate) {
                const updatedTerm = await termService.update(termToUpdate.id, formState)
                if (updatedTerm) {
                    updateOneTerm(updatedTerm)
                    navigate('/terms')
                }
            } else {
                const newTerm = await termService.create(formState)
                if (newTerm) {
                    addTerm(newTerm)
                    navigate('/terms')
                }
            }
        } catch (error) {
            console.log('Error submitting form:', error)
        }
    }

   return (
        <form onSubmit={handleSubmit}>
            <h2>{termToUpdate ? "Edit Term" : "New Term"}</h2>
            
            <label>Name:</label>
            <input name="name" value={formState.name} onChange={handleChange} placeholder="Name" required />
            
            <label>Definition (Math Mode):</label>

            <div style={{ border: '1px solid #ccc', margin: '5px 0' }}>
                <math-field 
                    onInput={evt => setFormState({ ...formState, definition: evt.target.value })}
                    style={{ width: '100%', padding: '8px' }}
                >
                    {formState.definition}
                </math-field>
            </div>

            <label>Example:</label>

            <div style={{ border: '1px solid #ccc', margin: '5px 0' }}>
                <math-field 
                    onInput={evt => setFormState({ ...formState, example: evt.target.value })}
                    style={{ width: '100%', padding: '8px' }}
                >
                    {formState.example}
                </math-field>
            </div>

            <label>Category:</label>
            <select name="category" value={formState.category} onChange={handleChange}>
                <option value="">-- Select a Category (Optional) --</option>
                {Object.keys(category).map((catName) => (
                    <option key={catName} value={catName}>
                        {category[catName]} {catName}
                    </option>
                ))}
            </select>

            <button type="submit">Save</button>    
        </form>
    )
}

export default TermForm
