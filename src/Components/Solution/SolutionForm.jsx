import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as solutionService from '../../services/solutionService'
import 'mathlive';
import './solutionForm.css'
import Swal from 'sweetalert2';

function SolutionForm({ updateSolution }) {
    const navigate = useNavigate()

    const { problemId, solutionId } = useParams()

    const [formState, setFormState] = useState({
        content: ''
    })

    useEffect(() => {
        const solutionEdit = async () => {
            if (!solutionId) return
            const latest = await solutionService.show(solutionId)
            if (latest) setFormState(latest)
        }
        solutionEdit()
    }, [solutionId])

    const { content } = formState;

    const handleChange = (event) => {
        setFormState({ ...formState, [event.target.name]: event.target.value });
    };
    // FOR THE KEYBOORD
    const handleMathChange = (event) => {
        setFormState({ ...formState, content: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            if (solutionId) {
                const updatedSolution = await solutionService.update(solutionId, formState);
                if (updatedSolution) {
                    navigate(`/problems/${problemId}`)
                }
            } else {

                const data = await solutionService.create(problemId, formState);
                if (data) {
                    updateSolution(data, problemId);
                }
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: error.message
            })
        }
    };

    return (
    <main className="solution-page-wrapper">
        <div className="form-card">
            <header className="form-header">
                <h1>{solutionId ? 'Edit Solution' : 'Add Solution'}</h1>
                <p>Use the math keyboard to write your steps accurately.</p>
            </header>

            <form onSubmit={handleSubmit} className="math-form">
                <div className="input-section">
                    <label htmlFor='content'>Your Mathematical Solution</label>
                    
                    <div className="math-field-container">
                        <math-field
                            onInput={handleMathChange}
                            smart-mode="true"
                            virtual-keyboard-mode="onfocus"
                            value={content}
                        ></math-field>
                    </div>
                </div>

                <div className="button-group">
                    <button type="submit" className="btn-primary">
                        {solutionId ? 'Update Solution' : 'Post Solution'}
                    </button>

                    <button type="button" className="btn-secondary" onClick={() => navigate(`/problems/${problemId}`)}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </main>
)
}

export default SolutionForm;