import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as solutionService from '../../services/solutionService'
import Swal from 'sweetalert2';

function SolutionForm({ updateSolution, solutionToUpdate, solution, problemId }) { 
    const navigate = useNavigate()
    const { solutionId } = useParams()
    const [formState, setFormState] = useState(solutionToUpdate ? solutionToUpdate : {
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

    const handleSubmit = async (event) => {
        event.preventDefault()

            if (solutionId) {
                const updatedSolution = await solutionService.update(solutionId, formState);                if (updatedSolution) {
                    navigate(`/solutions/${solutionId}`)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to update solution",
                    })
                }
            } else {
                const data = await serviceSolution.create(newFormState)
                if (data) {
                    updateSolution(data)
                    navigate(`/solutions/${data.id}`)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to create solution",
                    })
                }
            }

        const handleChange = (event) => {
        setFormState({ ...formState, [event.target.name]: event.target.value });
    };
        
        }
    return (
        <main className={styles.main}>
            <h1>Solution Form</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label className={styles.label} htmlFor='content'>Add the Solution</label>
                    <input
                        type='text'
                        id='content'
                        value={content}
                        name='content'
                        className={styles.input}
                        onChange={handleChange}
                    />
                </div>
                
                <div>
                    <button className={styles.button} type="submit">{solutionToUpdate ? 'Update Solution' : 'Create Solution'}</button>
                    <button className={styles.button} onClick={() => navigate('/')}>Cancel</button>
                </div>
            </form>
        </main>
    )
}

export default SolutionForm
