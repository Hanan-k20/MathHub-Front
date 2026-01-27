import { useState } from 'react';
import { submitvote } from "../../services/voteService";

function VoteButton({ problemId, solutionId, initialVoted, initialCount }) {
    const [isVoted, setIsVoted] = useState(initialVoted);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false); // هذا هو السطر الذي كان ينقصك

    const handleToggle = async () => {
        if (loading) return;

        const previousVoted = isVoted;
        const previousCount = count;

        setIsVoted(!isVoted);
        setCount(prev => isVoted ? prev - 1 : prev + 1);
        setLoading(true);

        try {
            const data = await submitvote(problemId, solutionId);
            setIsVoted(data.voted);
            setCount(data.total_votes);
        } catch (err) {
            console.error("Vote failed", err);
            setIsVoted(previousVoted);
            setCount(previousCount);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            disabled={loading}
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1.2rem',
                color: isVoted ? '#f9fd0b' : '#808080',
                transition: 'transform 0.1s',
                outline: 'none'
            }}
            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={isVoted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>

            <span style={{ fontWeight: 'bold', color: '#3c3a3a' }}>
                {count}
            </span>
        </button>
    );
}

export default VoteButton;