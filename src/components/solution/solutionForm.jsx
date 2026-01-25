import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as solutionService from '../../services/solutionService'
import Swal from 'sweetalert2';

function SolutionForm(props) {
    props={ updateSolution, solutionToUpdate ,solution, problemId }
    const navigate = useNavigate()
    const { solutionId } = useParams()
    const [formState, setFormState] = useState(solutionToUpdate ? solutionToUpdate : {
        content: ''
    })
    const [isVoted, setIsVoted] = useState(solution.is_voted_by_me); //initial from back end
    const [votesCount, setVotesCount] = useState(solution.votes_count);

  const handleToggleVote = async () => {
    try {
      const data = await submitvote(problemId, solution.id);
      setIsVoted(data.voted);
      setVotesCount(data.total_votes);
    } catch (error) {
      console.error("Error", error.message);
      Swal.fire({icon: "error",
                 title: "Oops...",
                 text: "You need to log in to vote!",
                 confirmButtonColor: "#FFD700",
                    })
    }
  };

    useEffect(() => {
        const solutionEdit = async () => {
            if (!solutionId) return
            const latest = await solutionService.show(solutionId)
            if (latest) setFormState(latest)
        }
        solutionEdit()
    }, [solutionId])

    const { content } = formState

    const handleCoords = () => {
        return new Promise((resolve, reject) => {
            window.navigator.geolocation.getCurrentPosition(resolve, reject)
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

            if (solutionId) {
                const updatedSolution = await serviceSolution.update(solutionId, newFormState)
                if (updatedSolution) {
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
                    navigate(`/solutions/${data._id}`)
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Failed to create solution",
                    })
                }
            }
        
        }
    return (
        <main className={styles.main}>
            <h1>Solution Form</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label className={styles.label} htmlFor='contant'>Add the Solution</label>
                    <input
                        type='text'
                        id='contant'
                        value={contant}
                        name='contant'
                        className={styles.input}
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
