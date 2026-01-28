import React from 'react'
import { Link } from 'react-router-dom';
import './termList.css'; 

function TermList({ terms }) {
    if (!terms) {
        return (
            <div className="loading-container">
                <div className="custom-loader"></div>
                <p>Fetching terms...</p>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="list-container">
                <header className="list-top-bar">
                    <div className="text-group">
                        <h1>Math Hub Dictionary</h1>
                        <p>{terms.length} terms available</p>
                    </div>
                    <Link to="/terms/new" className="add-button">
                        <span className="plus-icon">+</span> Add New
                    </Link>
                </header>

                {!terms.length ? (
                    <div className="empty-box">
                        <p>Your dictionary is empty. Start adding terms!</p>
                    </div>
                ) : (
                    <div className="cards-stack">
                        {terms.map((oneTerm) => (
                            <Link to={`/terms/${oneTerm.id}`} key={oneTerm.id} className="card-wrapper">
                                <div className="modern-card">
                                    <div className="card-left">
                                        <div className="accent-line"></div>
                                        <div className="term-details">
                                            <h2 className="term-name">{oneTerm.name}</h2>
                                            <span className="category-pill">{oneTerm.category || 'Mathematics'}</span>
                                        </div>
                                    </div>
                                    <div className="card-right">
                                        <span className="view-text">View Details</span>
                                        <div className="arrow-circle">→</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TermList;