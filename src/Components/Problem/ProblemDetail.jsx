import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as problemService from '../../services/problemService';
import * as solutionService from '../../services/solutionService';
import VoteButton from "../VoteButton/VoteButton";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import Swal from 'sweetalert2';
import './problemDetail.css';

const mathJaxConfig = {
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
        inlineMath: [["$", "$"], ["\\(", "\\)"]],
        displayMath: [["$$", "$$"], ["\\[", "\\]"]]
    }
};

function ProblemDetail({ findProblemToUpdate, deleteProblem, user, problemId: propId }) {
    const [problem, setProblem] = useState(null);
    const { problemId: paramId } = useParams();
    const problemId = propId || paramId;
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

    const handleDeleteProblem = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will delete the question and all its solutions!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await problemService.remove(problemId);
                deleteProblem?.(problemId);
                navigate('/problems');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete question', 'error');
            }
        }
    };

  

    if (!problem) return <h1 style={{ padding: "20px" }}>Loading Problem Data...</h1>;

    const isOwner = user && problem && String(user.sub) === String(problem.user_id);

    return (
        <MathJaxContext config={mathJaxConfig}>
            <div className="problem-page-wrapper">
                <div className="problem-container">

                    <header className="problem-main-header">
                        <span className="category-tag">Mathematical Problem</span>
                        <h1>{problem.title} <span className="dot">.</span></h1>
                    </header>

                    <section className="equation-section">
                        <div className="equation-display">
                            <MathJax>{`\\(${problem.equation_LaTeX}\\)`}</MathJax>
                        </div>
                    </section>

                    <section className="solutions-layout">
                        {/* AI Section */}
                        <div className="solution-entry ai-entry">
                            <div className="entry-label">AI ASSISTANT SOLUTION</div>
                            <div className="entry-content">
                                <MathJax dynamic>{problem.ai_solution || "Analyzing..."}</MathJax>
                            </div>
                        </div>

                        {/* User Solutions Section */}
                        <div className="user-solutions-area">
                            <h3>COMMUNITY SOLUTIONS ({problem.solutions?.length || 0})</h3>

                            {problem.solutions?.map(sol => (
                                <div key={sol.id} className="solution-entry user-entry">
                                

                                    <div className="entry-footer">
                                        <strong>By: {sol.user?.username || "User"}</strong>

                                        <div className="sol-actions">

                                            <VoteButton
                                                problemId={problem.id}
                                                solutionId={sol.id}
                                                initialCount={sol.votes_count}
                                            />
                                        </div>

                                        <div>
                                               <Link to={`/problems/${problemId}/solutions/${sol.id}`}>
                                            See the Answer ⭢
                                    </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <footer className="problem-actions">
                        {user && (
                            <>
                                {user.username === problem.user?.username ? (
                                    <div className="owner-controls">
                                        <Link
                                            className="btn btn-outline"
                                            to={`/problems/${problemId}/update`}
                                            onClick={() => findProblemToUpdate(problem)}
                                        >
                                            📝 EDIT QUESTION
                                        </Link>
                                        <button onClick={handleDeleteProblem} className="btn btn-danger">
                                            🗑️ DELETE QUESTION
                                        </button>
                                    </div>
                                ) : (
                                    <Link to={`/problems/${problemId}/solutions/new`} className="btn btn-primary">
                                        💡 ADD YOUR SOLUTION
                                    </Link>
                                )}
                            </>
                        )}
                    </footer>

                </div>
            </div>
        </MathJaxContext>
    );
}

export default ProblemDetail;