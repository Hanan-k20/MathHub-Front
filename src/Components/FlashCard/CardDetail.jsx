import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MathJaxContext, MathJax } from 'better-react-mathjax';
import './CardDetail.css'; 

function CardDetail({ problem, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  if (!problem) return <div className="card-detail-wrapper"><p className="loading">Loading...</p></div>;

  return (
    <MathJaxContext config={{ tex: { inlineMath: [['$', '$'], ['\\(', '\\)']] } }}>
      <div className="card-detail-wrapper">
        <div 
          className={`flashcard-container ${isFlipped ? 'flipped' : ''}`} 
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className="flashcard-inner">

            <div className="card-face card-front">
              <button className="close-button" onClick={onClose}>✕</button>
              <span className="card-label">Question</span>
              <div className="content-group">
                <h3>{problem.title}</h3>
                <div className="math-display">
                  <MathJax>{"\\(" + (problem.equation_LaTeX || "") + "\\)"}</MathJax>
                </div>
              </div>
              <small className="flip-hint">Click to see solution ↻</small>
            </div>

            <div className="card-face card-back">
              <span className="card-label" >Solution</span>
              <div className="content-group">
                <div className="scroll-box">
                  <MathJax dynamic className="math-display ">{problem.ai_solution || "No solution found"}</MathJax>
                </div>
              </div>
              <small className="flip-hint" style={{color: '#fff'}}>Click to go back ↻</small>
            </div>

          </div>
        </div>
      </div>
    </MathJaxContext>
  );
}

export default CardDetail;