import React, { useState } from 'react';
import CardDetail from './CardDetail';
import './CardList.css'; 

function CardList({ cards }) {
  const [activeProblem, setActiveProblem] = useState(null);

  if (!cards || cards.length === 0) {
    return (
      <div className="container">
        <h1 id="H1">No Cards Found</h1>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 id="H1">Here's all the Cards</h1>

      <div className="cards-grid"> 
        {cards.map((oneCard) => (
          <div key={oneCard.id} className="card-item">
            <div className="card-header">
              <h3>{oneCard.title}</h3>
            </div>

            <div className="card-footer">
              <button
                onClick={() => setActiveProblem(oneCard)}
                className="btn-card-details"
              >
                See Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {activeProblem && <CardDetail problem={activeProblem} onClose={() => setActiveProblem(null)} />}
    </div>
  );
}

export default CardList;