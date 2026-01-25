import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as solutionService from '../../services/solutionService'
import Swal from 'sweetalert2';

function ProblemDetail(props) {
    props={ updateSolution, solutionToUpdate ,solution, problemId }
   
    const [isVoted, setIsVoted] = useState(solution.is_voted_by_me); //initial from back end
    const [votesCount, setVotesCount] = useState(solution.votes_count);

  const handleToggleVote = async () => {
    try {
      const data = await submitvote(problemId, solution.id);
      setIsVoted(data.voted);
      setVotesCount(data.total_votes);
    } catch (error) {
      console.error("Error", error.message);
      Swal.fire({icon: "error",
                 title: "Oops...",
                 text: "You need to log in to vote!",
                 confirmButtonColor: "#FFD700",
                    })
    }
    };

        
    return (
        <main className={styles.main}>
            <div className="solution-card">
                <p>{solution.content}</p>

                <button
                    onClick={handleToggleVote}
                    className={`vote-btn ${isVoted ? 'active' : ''}`}
                    style={{
                        color: isVoted ? "#FFD700" : "#808080", 
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                        fontSize: "1.2rem"
                    }}
                >
                    <i className={isVoted ? "fa-solid fa-star" : "fa-regular fa-star"}></i>
                    <span style={{ marginLeft: "8px" }}>{votesCount}</span>
                </button>
            </div>
        </main>
    )
}

export default ProblemDetail
