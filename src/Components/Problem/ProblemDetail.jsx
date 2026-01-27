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

  const handleDeleteSolution = async (sId) => {
    const result = await Swal.fire({
      title: 'Delete your solution?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    });

    if (result.isConfirmed) {
      try {
        await solutionService.remove(sId);
        setProblem(prev => ({
          ...prev,
          solutions: prev.solutions.filter(s => s.id !== sId)
        }));
        Swal.fire('Deleted!', '', 'success');
      } catch (error) {
        Swal.fire('Error', 'Failed to delete solution', 'error');
      }
    }
  };

  if (!problem) return <h1 style={{ padding: "20px" }}>Loading Problem Data...</h1>;

  // صاحب السؤال
  const isQuestionOwner = user && (user.username === problem.user?.username || user.id === problem.user_id);

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
            <div className="solution-entry ai-entry">
              <div className="entry-label">AI ASSISTANT SOLUTION</div>
              <div className="entry-content">
                <MathJax dynamic>{problem.ai_solution || "Analyzing..."}</MathJax>
              </div>
            </div>

            <div className="user-solutions-area">
              <h3>COMMUNITY SOLUTIONS ({problem.solutions?.length || 0})</h3>

              {problem.solutions?.map(sol => (
                <div key={sol.id} className="solution-entry user-entry">
                  <div className="entry-content">
                    <MathJax>{`\\(${sol.content}\\)`}</MathJax>
                  </div>

                  <div className="entry-footer">
                    <strong>By: {sol.user?.username || "User"}</strong>

                    <div className="sol-actions">
                      {/* تعديل وحذف الحل يظهر فقط لصاحب الحل */}
                      {user && (user.id === sol.user_id || user.username === sol.user?.username) && (
                        <div className="mini-buttons">
                          <Link to={`/problems/${problemId}/solutions/${sol.id}/update`} className="edit-link">Edit</Link>
                          <button onClick={() => handleDeleteSolution(sol.id)} className="delete-link">Delete</button>
                        </div>
                      )}

                      <VoteButton
                        problemId={problem.id}
                        solutionId={sol.id}
                        initialCount={sol.votes_count}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="problem-actions">
            {/* أزرار السؤال: تظهر فقط لصاحب السؤال */}
            {isQuestionOwner && (
              <>
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
              </>
            )}

            {/* زر إضافة حل: يظهر للمسجلين دخول بشرط ألا يكونوا أصحاب السؤال */}
            {user && !isQuestionOwner && (
              <Link to={`/problems/${problemId}/solutions/new`} className="btn btn-primary">
                💡 ADD YOUR SOLUTION
              </Link>
            )}

            <button onClick={() => navigate('/problems')} className="btn btn-dark">BACK</button>
          </footer>

        </div>
      </div>
    </MathJaxContext>
  );
}

export default ProblemDetail;