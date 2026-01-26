import { useState } from 'react'; 
import { submitvote } from "../../services/voteService";

function VoteButton({ problemId, solutionId, initialVoted, initialCount }) {
    const [isVoted, setIsVoted] = useState(initialVoted);
    const [count, setCount] = useState(initialCount);

    const handleToggle = async () => {
        try {
            const data = await submitvote(problemId, solutionId);
            setIsVoted(data.voted);
            setCount(data.total_votes);
        } catch (err) {
            console.error("Vote failed", err);
        }
    };

    return (
        <button
            type="button" 
            onClick={handleToggle} 
            style={{
                color: isVoted ? '#d4ef0d' : '#808080', 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.2rem'
            }}
        >
            <i className={isVoted ? "fa-solid fa-thumbs-up" : "fa-regular fa-thumbs-up"}></i>
            <span style={{ marginLeft: '5px' }}>{count}</span> 
        </button>
    );
}

export default VoteButton;