import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as solutionService from '../../services/solutionService';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import Swal from 'sweetalert2';
import "./solutionDetail.css"

const mathJaxConfig = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]]
    }
};

function SolutionDetail({ user, findSolutionToUpdate }) {
    const [solution, setSolution] = useState(null);
    const { solutionId, problemId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getOneSolution = async (sId) => {
            try {
                const data = await solutionService.show(sId);
                setSolution(data);
            } catch (error) {
                console.error("Error fetching solution:", error);
            }
        };
        if (solutionId) getOneSolution(solutionId);
    }, [solutionId]);

    const handleDeleteSolution = async (sId) => {
        const result = await Swal.fire({
            title: 'Delete your solution?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            confirmButtonColor: '#ff0000',
        });

        if (result.isConfirmed) {
            try {
                await solutionService.remove(sId);
                Swal.fire('Deleted!', '', 'success');
                navigate(`/problems/${problemId}`);
            } catch (error) {
                Swal.fire('Error', 'Failed to delete', 'error');
            }
        }
    };

    if (!solution) return <div className="solution-detail-container"><p>Loading Solution...</p></div>;

    const isOwner = user && solution.user && user.username === solution.user.username;

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="solution-detail-container">
                <div className="solution-card">
                    <h2>Solution Detail</h2>
                    
                    <div className="entry-content">
                        <MathJax>{`\\(${solution.content}\\)`}</MathJax>
                    </div>

                    <div className="entry-footer">
                        <p><strong>By:</strong> {solution.user?.username || "Unknown"}</p>
                    </div>

                    <hr />

                    {isOwner ? (
                        <div className="mini-buttons">
                            <Link 
                                to={`/problems/${problemId}/solutions/${solution.id}/update`} 
                                className="btn-edit"
                                onClick={() => findSolutionToUpdate(problemId, solution.id)}
                            >
                                Edit
                            </Link>
                            <button 
                                onClick={() => handleDeleteSolution(solution.id)} 
                                className="delete-link"
                            >
                                Delete
                            </button>
                        </div>
                    ) : (
                        <p className="viewer-msg">Viewing as visitor</p>
                    )}

                    <div className="actions-footer">
                        <button onClick={() => navigate(-1)} className="btn-dark">Back</button>
                    </div>
                </div>
            </div>
        </MathJaxContext>
    );
}

export default SolutionDetail;