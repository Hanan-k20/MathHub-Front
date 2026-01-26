import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import * as problemService from '../../services/problemService';
import MathJax from 'react-mathjax2';
import Swal from 'sweetalert2';

function ProblemDetail({ findProblemToUpdate, deleteProblem,user}) {

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
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the question!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await problemService.deleteOne(id);
                deleteProblem(id);
                Swal.fire('Deleted!', 'The question has been removed.', 'success');
                navigate('/');
            } catch (error) {
                Swal.fire('Error', 'Something went wrong while deleting', 'error');
            }
        }
    }
    if (!id) return <h1>Loading...</h1>
    if (!problem) return <h1>Loading...</h1>

    return (

       <div>
            <MathJax.Context 
                script="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML"
            >
                <div>
                    <h1>Question topic: {problem.title}</h1>

                    <div style={{ margin: '20px 0', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                        {/* استخدام MathJax.Node يجعل المعادلة تظهر في سطر مستقل وبشكل أوضح */}
                        <MathJax.Node>{problem.equation_LaTeX}</MathJax.Node>
                    </div>

                    <h3>AI Solution:</h3>
                    <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px', padding: '10px', borderLeft: '4px solid #4CAF50' }}>
                        <MathJax.Text>{problem.ai_solution || "Processing AI solution..."}</MathJax.Text>
                    </div>

                    <h6>Created at: {problem.created_At}</h6>
                    
                    <hr />
                    
                    <h3>User Solutions:</h3>
                    <div>
                        {problem.Solutions && problem.Solutions.length > 0 ? (
                            problem.Solutions.map((oneSolution) => (
                                <div key={oneSolution.id} style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                                    <div>
                                        <strong>Solution:</strong> 
                                        <MathJax.Text>{oneSolution.content}</MathJax.Text>
                                    </div>
                                    <p><small>By: {oneSolution.user?.username || "Anonymous"}</small></p>
                                </div>
                            ))
                        ) : (
                            <p>No user solutions yet.</p>
                        )}
                    </div>

                    {problem.user_id === user?.id && (
                        <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <Link 
                                className="btn-edit"
                                onClick={() => findProblemToUpdate(id)} 
                                to={`/problem/${id}/update`}
                                style={{ color: '#007bff', fontWeight: 'bold' }}
                            >
                                📝 Edit Question
                            </Link>
                            <button 
                                onClick={handleDelete}
                                style={{ background: 'none', border: 'none', color: '#d33', cursor: 'pointer', textDecoration: 'underline', fontSize: '16px' }}
                            >
                                🗑️ Delete Question
                            </button>
                        </div>
                    )}


                    {user && problem.user_id !== user.id && (
                        <div style={{ marginTop: '30px' }}>
                            <Link 
                                to={`/problems/${id}/solutions/new`} 
                                style={{ 
                                    padding: '12px 25px', 
                                    backgroundColor: '#28a745', 
                                    color: 'white', 
                                    borderRadius: '5px', 
                                    textDecoration: 'none',
                                    display: 'inline-block',
                                    fontWeight: 'bold',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                }}
                            >
                                💡 Add Your Solution
                            </Link>
                        </div>
                    )}
                </div>
            </MathJax.Context>
            
        </div>

    )
}

export default ProblemDetail
