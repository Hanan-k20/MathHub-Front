import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import * as problemService from '../../services/problemService';
import MathJax from 'react-mathjax2';
import Swal from 'sweetalert2';

function ProblemDetail({ findProblemToUpdate, deleteProblem }) {

    const [problem, setProblem] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()
    useEffect(
        () => {
            const getOneProblem = async (id) => {
                const problem = await problemService.show(id)
                setProblem(problem)
            }
            if (id) getOneProblem(id)
        }, [id])


    const handleDelete = async () => {
        try {
            const deletProblem = await problemService.deleteOne(id)
            deleteProblem(id)
            navigate('/')
        } catch (error) {
            console.log('something went wrong')

        }
    }
    if (!id) return <h1>Loading...</h1>
    if (!problem) return <h1>Loading...</h1>

    return (

        <div>
            <MathJax.Context >
                <h1>Question topic:{problem.title}</h1>

                <div>
                    <MathJax.Text>{problem.equation_LaTeX}</MathJax.Text>
                </div>

                <h3>AI Solution:</h3>

                <div style={{ whiteSpace: 'pre-wrap' }}>
                    <MathJax.Text>{problem.ai_solution}</MathJax.Text>
                </div>

                <h6>Created at:{problem.created_At}</h6>
                <h3>User Solutions:</h3>
                <div>
                    {problem.Solutions && problem.Solutions.length > 0 ? (
                        problem.Solutions.map((oneSolution) => (
                            <div key={oneSolution.id} >

                                <div>
                                    <strong>Solution:</strong>  <MathJax.Text>{oneSolution.content}</MathJax.Text>
                                </div>

                                <p><small>By: {oneSolution.user.username}</small></p>
                            </div>
                        ))
                    ) : (
                        <p>No user solutions yet.</p>
                    )}
                </div>

                <div>
                    <Link onClick={() => findProblemToUpdate(id)} to={`/problem/${id}/update`}>Edit the question</Link>
                    <br />
                    <button onClick={handleDelete}>Delete the question</button>
                </div>

            </MathJax.Context>
        </div>

    )
}

export default ProblemDetail
