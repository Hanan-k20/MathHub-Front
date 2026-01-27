import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import * as problemService from '../../services/problemService';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import Swal from 'sweetalert2';

const mathJaxConfig = {
  loader: { load: ["input/tex", "output/chtml"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]]
  }
};

function ProblemDetail({ findProblemToUpdate, deleteProblem, user }) {
    const [problem, setProblem] = useState(null);
    const { problemId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getOneProblem = async (pId) => {
            try {
                const data = await problemService.show(pId);
                setProblem(data);
            } catch (error) {
                console.error("Error fetching problem:", error);
            }
        };
        if (problemId) getOneProblem(problemId);
    }, [problemId]);

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
                await problemService.deleteOne(problemId);
                deleteProblem(problemId);
                Swal.fire('Deleted!', 'The question has been removed.', 'success');
                navigate('/problems');
            } catch (error) {
                Swal.fire('Error', 'Something went wrong while deleting', 'error');
            }
        }
    };

    if (!problemId || !problem) return <h1>Loading...</h1>;

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div>
                <h1>Question topic: {problem.title}</h1>

                <div style={{ margin: '20px 0', padding: '10px', background: '#f9f9f9', borderRadius: '8px' }}>
                    <MathJax>
                        {`\\(${problem.equation_LaTeX}\\)`}
                    </MathJax>
                </div>

                <h3>AI Solution:</h3>
                <div style={{ whiteSpace: 'pre-wrap', marginBottom: '20px', padding: '10px', borderLeft: '4px solid #4CAF50' }}>
                    <MathJax dynamic>
                        {problem.ai_solution || "Loading solution..."}
                    </MathJax>
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
                                    <MathJax dynamic>{oneSolution.content}</MathJax>
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
                            onClick={() => findProblemToUpdate(problem)} 
                            to={`/problems/${problemId}/update`}
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
                            to={`/problems/${problemId}/solutions/new`} 
                            style={{ 
                                padding: '12px 25px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                borderRadius: '5px', 
                                textDecoration: 'none',
                                display: 'inline-block',
                                fontWeight: 'bold'
                            }}
                        >
                            💡 Add Your Solution
                        </Link>
                    </div>
                )}
            </div>
        </MathJaxContext>
    );
}

export default ProblemDetail;