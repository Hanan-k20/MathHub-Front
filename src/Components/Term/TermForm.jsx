import { useState } from 'react'
import { useNavigate, useParams } from "react-router";
import * as termService from '../../services/termService'
import 'mathlive';
import './termForm.css'
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
    const { addTerm, termToUpdate, updateOneTerm } = props
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
    <div className="term-form-container">
        <div className="term-form-card">
            <h2>{termToUpdate ? "Edit Term" : "New Term"}</h2>
            
            <form onSubmit={handleSubmit}>
                <div className="term-field-group">
                    <label>Title:</label>
                    <input 
                        name="name" 
                        placeholder="Enter term name..."
                        value={formState.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>

                <div className="term-field-group">
                    <label>Definition:</label>
                    <div className="math-input-wrapper">
                        <math-field
                            onInput={evt => setFormState({ ...formState, definition: evt.target.value })}
                            smart-mode="true"
                            virtual-keyboard-mode="onfocus"
                            smart-fence="true"
                        >
                            {formState.definition}
                        </math-field>
                    </div>
                </div>

                <div className="term-field-group">
                    <label>Example:</label>
                    <div className="math-input-wrapper">
                        <math-field
                            onInput={evt => setFormState({ ...formState, example: evt.target.value })}
                            smart-mode="true"
                            virtual-keyboard-mode="onfocus"
                        >
                            {formState.example}
                        </math-field>
                    </div>
                </div>

                <div className="term-field-group">
                    <label>Category:</label>
                    <select name="category" value={formState.category} onChange={handleChange}>
                        <option value="">-- Select Category --</option>
                        {Object.keys(category).map((catName) => (
                            <option key={catName} value={catName}>
                                {category[catName]} {catName}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="term-save-btn">Save Term</button>
            </form>
        </div>
    </div>
);
}

export default TermForm
