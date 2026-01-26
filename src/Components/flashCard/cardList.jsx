import React from 'react';
import { Link } from 'react-router-dom';

function CardList({ _id, title, user }) {
 

  return (
    <div className="card-item">
      <div className="card-header">
        <h3>{title}</h3>
      </div>

      <div className="card-footer">
        <p>Owner: <strong>{user?.username}</strong></p>
        
        <Link to={`/cards/${_id}`} className="btn-card-details">
          See Details
        </Link>
      </div>
    </div>
  );
}

export default CardList;