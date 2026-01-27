import { useNavigate } from 'react-router';
import VoteButton from "../VoteButton/VoteButton";

function ProblemList({ problems }) {
    const navigate = useNavigate();

    if (!problems) {
        return <h1>Loading....</h1>
    }
    return (
        <div>
            <h1>List</h1>
            {!problems.length ? (
                <div>No problems Found</div>
            ) : (
                <ul>
                    {problems.map((oneProblem) => (
                        <li key={oneProblem.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', listStyle: 'none' }}>
                            <div style={{ cursor: 'pointer' }} onClick={() => navigate(`/problems/${oneProblem.id}`)}>
                                <strong>{oneProblem.title}</strong>
                                <br />
                                <span>By: {oneProblem.user?.username || 'Unknown'}</span>
                            </div>

                            <div style={{ marginTop: '5px' }}>
                                <VoteButton problemId={oneProblem.id} />
                            </div>

                        </li>

                    ))}

                </ul>
                
            )}
                <button onClick={() => navigate('/problems/new')}>Add New Problem</button>
        </div>
    );
}

export default ProblemList
