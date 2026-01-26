import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as solutionService from '../../services/solutionService'
import 'mathlive'; 
import Swal from 'sweetalert2';

function SolutionForm({ updateSolution, solutionToUpdate }) { 
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
                    if(updateSolution) updateSolution(data)
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
                        placeholder="Write or use keyboard below"
                    />
                    {/* MATH KEYBOARD */}
                    <div style={{ border: '1px solid #ccc', borderRadius: '4px' }}>
                           <math-field 
                               onInput={handleMathChange}
                               style={{ width: '100%', padding: '10px' }}
                           >
                               {formState.content}
                           </math-field>
                       </div>
                    </div>
        
                
                <div style={{ marginTop: '20px' }}>
                    <button className={styles.button} type="submit">
                        {solutionId ? 'Update Solution' : 'Create Solution'}
                    </button>
                    <button className={styles.button} type="button" onClick={() => navigate('/')}>
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    )
}

export default SolutionForm;