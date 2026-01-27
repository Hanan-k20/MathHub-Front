import React from 'react';
import { Link } from 'react-router-dom';

function CardList({ cards }) {
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
              <p>
                Owner: <strong>{oneCard.owner?.username || "Unknown"}</strong>
              </p>
              <Link to={`/cards/${oneCard.id}`} className="btn-card-details">
                See Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardList;