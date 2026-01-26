import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LatexRenderer from './LatexRenderer'; 
import ReactCardFlip from 'react-card-flip';


function CardDetail({ problem }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setIsFlipped(!isFlipped);
  };

  const handleClose = () => {
    navigate('/cards'); 
  };

  return (
    <>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      < div style={cardStyle}>
       <p>{problem.title}</p>
       <LatexRenderer latex={problem.equation_LaTeX} />
        <button onClick={handleClick}>Flip to see the answe</button>
        <button onClick={handleClose} className="close-button">إغلاق</button>

      </div>

      <div style={cardStyle}>
       <p>Solution</p>
        <LatexRenderer latex={problem.ai_solution} />
        <button onClick={handleClick}>Back to qustion</button>
        <button onClick={handleClose} className="close-button">🗙</button>

      </div>
    </ReactCardFlip>

</>
  );
}

export default CardDetail;

