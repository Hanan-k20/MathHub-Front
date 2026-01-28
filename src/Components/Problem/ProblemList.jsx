import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProblemDetail from './ProblemDetail';
import './problemList.css';

function ProblemList({ problems, user, deleteProblem, findProblemToUpdate }) {   
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (selectedId && !problems.find(p => p.id === selectedId)) {
            setSelectedId(null);
        }
    }, [problems, selectedId]);

    if (!problems) {
        return <div className="loading-state"><h1>Loading....</h1></div>;
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
                                key={oneProblem?.id || Math.random()} 
                                className={`problem-card ${selectedId === oneProblem?.id ? 'active' : ''}`} 
                                onClick={() => setSelectedId(oneProblem?.id)} 
                            >
                                <div className="problem-info">
                                    <strong>{oneProblem?.title || 'Untitled'}</strong>
                                    <span>By: {oneProblem?.user?.username || 'Unknown'}</span>
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