import { useState } from 'react'
import { useNavigate, useParams } from "react-router";
import * as termService from '../../services/termService'
import MathView from 'react-mathlive';
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

function TermForm({ addTerm, termToUpdate, updateOneTerm }) {
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
            <input name="name" value={formState.name} onChange={handleChange} placeholder="Name" required />
            <label>Definition (Math Mode):</label>
            <MathView
                mathfieldConfig={{
                    smartFence: true,
                    virtualKeyboardMode: "onfocus",
                }}
                value={formState.definition}
                onChange={(value) => setFormState({ ...formState, definition: value })} />

            <label>Example:</label>
            <MathView
                value={formState.example}
                 onChange={(value) => setFormState({ ...formState, example: value })}/>

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