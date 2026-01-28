import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import * as problemService from '../../services/problemService';
import VoteButton from "../VoteButton/VoteButton";
import { MathJax } from 'better-react-mathjax';
import Swal from 'sweetalert2';
import './problemDetail.css';

function ProblemDetail({ findProblemToUpdate, deleteProblem, user, problemId: propId }) {
    const [problem, setProblem] = useState(null);
    const { problemId: paramId } = useParams();
    const problemId = propId || paramId;
    const navigate = useNavigate();

    const cleanLaTeX = (text) => {
        if (!text) return "";
        return text.replace(/^\$/, '').replace(/\$$/, '').trim();
    };

    useEffect(() => {
        const getOneProblem = async (pId) => {
            try {
                const data = await problemService.show(pId);
                setProblem(data);
            } catch (error) {
                console.error(error);
            }
        };
        if (problemId) getOneProblem(problemId);
    }, [problemId]);

    const handleDeleteProblem = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Delete'
        });
        if (result.isConfirmed) {
            try {
                await problemService.remove(problemId);
                deleteProblem?.(problemId);
                navigate('/problems');
            } catch (error) {
                Swal.fire('Error', 'Failed', 'error');
            }
        }
    };

    if (!problem) return <h1 style={{ padding: "20px" }}>Loading...</h1>;

    return (
        <div className="problem-page-wrapper">
            <div className="problem-container">
                <header className="problem-main-header">
                    <span className="category-tag">Mathematical Problem</span>
                    <h1>{problem.title}</h1>
                </header>

                <section className="equation-section">
                    <div className="equation-display">
                        <MathJax>{`\\(${cleanLaTeX(problem.equation_LaTeX)}\\)`}</MathJax>
                    </div>
                </section>

                <section className="solutions-layout">
                    <div className="solution-entry ai-entry">
                        <div className="entry-label">AI ASSISTANT SOLUTION</div>
                        <div className="entry-content">
                            <MathJax dynamic>
                                {problem.ai_solution}
                            </MathJax>
                        </div>
                    </div>

                    <div className="user-solutions-area">
                        <h3>COMMUNITY SOLUTIONS ({problem.solutions?.length || 0})</h3>
                        {problem.solutions?.map(sol => (
                            <div key={sol.id} className="solution-entry user-entry">
                                <div className="entry-content">
                                    <MathJax>{sol.content}</MathJax>
                                </div>
                                <div className="entry-footer">
                                    <strong>By: {sol.user?.username}</strong>
                                    <div className="sol-actions">
                                        <VoteButton
                                            problemId={problem.id}
                                            solutionId={sol.id}
                                            initialCount={sol.votes_count}
                                        />
                                    </div>
                                    <Link to={`/problems/${problemId}/solutions/${sol.id}`} className="view-answer-link">View Answer</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="problem-actions">
                    {user && user.username === problem.user?.username ? (
                        <div className="owner-controls">
                            <Link className="btn btn-outline" to={`/problems/${problemId}/update`} onClick={() => findProblemToUpdate(problem)}>EDIT</Link>
                            <button onClick={handleDeleteProblem} className="btn btn-danger">DELETE</button>
                        </div>
                    ) : (
                        user && <Link to={`/problems/${problemId}/solutions/new`} className="btn btn-primary">ADD SOLUTION</Link>
                    )}
                </footer>
            </div>
        </div>
    );
}

export default ProblemDetail;