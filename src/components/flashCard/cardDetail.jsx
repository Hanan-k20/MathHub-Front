import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactCardFlip from 'react-card-flip';
import 'katex/dist/katex.min.css'; //ketex laibrary
import { InlineMath, BlockMath } from 'react-katex';

function CardDetail({ problem }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  if (!problem) return <p>Loading...</p>;

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  return (
    <div style={{ padding: '20px' }}>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">

        <div style={cardStyle}>
          <h3>{problem.title}</h3>
          <div style={mathContainer}>
            <BlockMath math={problem.equation_LaTeX || ''} />
          </div>
          <button onClick={handleClick}>Flip to see answer</button>
          <button onClick={() => navigate('/cards')}>إغلاق</button>
        </div>

        <div style={cardStyle}>
          <h3>Solution</h3>
          <div style={mathContainer}>
            <BlockMath math={problem.ai_solution || ''} />
          </div>
          <button onClick={handleClick}>Back to question</button>
          <button onClick={() => navigate('/cards')}>🗙</button>
        </div>
      </ReactCardFlip>
    </div>
  );
}

export default CardDetail;