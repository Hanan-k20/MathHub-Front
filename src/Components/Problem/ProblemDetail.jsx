import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import * as problemService from '../../services/problemService';
import VoteButton from "../VoteButton/VoteButton";
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import Swal from 'sweetalert2';
import './problemDetail.css'

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
                await problemService.remove(problemId);

                Swal.fire('Deleted!', 'The question has been removed.', 'success');

                navigate('/problems');

                if (deleteProblem) deleteProblem(problemId);
            } catch (error) {
                Swal.fire('Error', 'Something went wrong while deleting', 'error');
            }
        }
    };

    if (!problemId || !problem) return <h1>Loading...</h1>;

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
                        <div className="meta-info">
                            <span>ID: #{String(problemId).slice(-5)}</span>
                            <span>{problem.created_At}</span>
                        </div>
                    </section>

                    <section className="solutions-layout">
                        <div className="solution-entry ai-entry">
                            <div className="entry-label">AI ASSISTANT SOLUTION</div>
                            <div className="entry-content">
                                <MathJax dynamic>
                                    {problem.ai_solution || "Analyzing problem..."}
                                </MathJax>
                            </div>
                        </div>

                        <div className="user-solutions-area">
                            <h3 className="user-solutions-header">
                                COMMUNITY SOLUTIONS ({problem.solutions?.length || 0})
                            </h3>

                            {problem.solutions && problem.solutions.length > 0 ? (
                                problem.solutions.map((oneSolution) => (
                                    <div key={oneSolution.id} className="solution-entry user-entry">
                                        <div className="entry-content">
                                            <MathJax>{`\\(${oneSolution.content}\\)`}</MathJax>

                                        </div>

                                        <div className="entry-footer">
                                            <div className="user-info">
                                                <span className="avatar-placeholder"></span>
                                                <strong>{oneSolution.user?.username || "Anonymous"}</strong>
                                            </div>

                                            <div className="vote-section">
                                                <VoteButton
                                                    problemId={problem.id}
                                                    solutionId={oneSolution.id}
                                                    initialVoted={oneSolution.is_voted}
                                                    initialCount={oneSolution.votes_count || 0}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-solutions-placeholder">
                                    <p>No community solutions yet. Be the first!</p>
                                </div>
                            )}
                        </div>


                    </section>

                    <footer className="problem-actions">
                        {(user?.username === problem.user?.username || user?.sub === String(problem.user_id)) ? (
                            <>
                                <Link
                                    className="btn btn-outline"
                                    onClick={() => findProblemToUpdate(problem)}
                                    to={`/problems/${problemId}/update`}
                                >
                                    📝 EDIT
                                </Link>
                                <button onClick={handleDelete} className="btn btn-danger">
                                    🗑️ DELETE
                                </button>
                            </>
                        ) : (
                            user && (
                                <Link to={`/problems/${problemId}/solutions/new`} className="btn btn-primary">
                                    💡 ADD YOUR SOLUTION
                                </Link>
                            )
                        )}
                        <button onClick={() => navigate('/problems')} className="btn btn-dark">BACK</button>
                    </footer>
                </div>
            </div>
        </MathJaxContext>
    );
}

export default ProblemDetail;