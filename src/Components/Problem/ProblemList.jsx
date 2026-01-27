import { useNavigate } from 'react-router';
import { useState } from 'react';
import ProblemDetail from './ProblemDetail';
import './problemList.css'

function ProblemList({ problems, user, deleteProblem, findProblemToUpdate }) {  
      const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);

    if (!problems) {
        return <h1>Loading....</h1>
    }
  return (
        <div className="page-layout"> 
            <div className="problems-container">
                <div className="problems-header">
                    <h1 id="H1">Problems <span>List</span></h1>
                    <button className="btn-add-new" onClick={() => navigate('/problems/new')}>
                        + Add New Problem
                    </button>
                </div>

                {!problems.length ? (
                    <div className="no-data">No problems Found</div>
                ) : (
                    <div className="problems-grid">
                        {problems.map((oneProblem) => (
                            <div 
                                key={oneProblem.id} 
                                className={`problem-card ${selectedId === oneProblem.id ? 'active' : ''}`} 
                                onClick={() => setSelectedId(oneProblem.id)} 
                            >
                                <div className="problem-info">
                                    <strong>{oneProblem.title}</strong>
                                    <span>By: {oneProblem.user?.username || 'Unknown'}</span>
                                </div>
                                <div className="problem-arrow">→</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="details-white-section">
                {selectedId ? (
                    <ProblemDetail 
                        problemId={selectedId} 
                        user={user} 
                        deleteProblem={deleteProblem} 
                        findProblemToUpdate={findProblemToUpdate} 
                    />
                ) : (
                    <div className="placeholder-text">Select a problem to see the solution</div>
                )}
            </div>
        </div>
    );
}

export default ProblemList;