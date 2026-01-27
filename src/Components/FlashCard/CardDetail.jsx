import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';
import './CardDetail.css'; 

function CardDetail({ problem }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  if (!problem) return <p className="loading">Loading...</p>;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleClose = (event) => {
    event.stopPropagation(); 
    navigate('/cards');
  };

  return (
    <div className="card-detail-wrapper">
      <div 
        className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleFlip}
      >
        <div className="flashcard-inner">
          
          <div className="card-face card-front">
            <button className="close-button" onClick={handleClose}>✕</button>
            <span className="card-label">Question</span>
            <div className="content-group">
              <h3>{problem.title}</h3>
              <div className="math-display">
                <BlockMath math={problem.equation_LaTeX || ''} />
              </div>
            </div>
            <small className="flip-hint">Click to see solution ↻</small>
          </div>

          <div className="card-face card-back">
            <button className="close-button" onClick={handleClose}>✕</button>
            <span className="card-label">Solution</span>
            <div className="content-group">
              <div className="math-display">
                <BlockMath math={problem.ai_solution || ''} />
              </div>
            </div>
            <small className="flip-hint">Click to go back ↻</small>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CardDetail;