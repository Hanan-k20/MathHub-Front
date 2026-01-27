import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as solutionService from '../../services/solutionService'
import 'mathlive';
import Swal from 'sweetalert2';

function SolutionForm({ updateSolution }) {
    const navigate = useNavigate()
    const { solutionId } = useParams()

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
                    navigate(`/solutions/${solutionId}`)
                }
            } else {
                const data = await solutionService.create(formState)
                if (data) {
                    if (updateSolution) updateSolution(data)
                    navigate(`/solutions/${data.id}`)
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
        <main>
            <h1>{solutionId ? 'Edit Solution' : 'Add Solution'}</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='content'>Your Solution:</label>

                    <input type='text' id='content' value={content} name='content' onChange={handleChange}
                        placeholder="Write or use keyboard below" />

                    {/* (MathLive) */}
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px', margin: '5px 0' }}>
                        <math-field
                            onInput={handleMathChange}
                            smart-mode="true"
                            virtual-keyboard-mode="onfocus"
                            style={{ width: '100%', padding: '10px' }}
                            value={content}
                        >
        
                        </math-field>
                    </div>


                </div>

                <div>
                    <button type="submit">
                        {solutionId ? 'Update Solution' : 'Create Solution'}
                    </button>

                    <button type="button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    )
}

export default SolutionForm;