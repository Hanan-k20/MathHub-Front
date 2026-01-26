import { useNavigate } from 'react-router';
import VoteButton from './VoteButton';
function ProblemList({ problems }) {
    const navigate = useNavigate();

    if(!problems){
    return <h1>Loading....</h1>
  }
  return (
    
     <div>
      <h1> List</h1>
      {
        !problems.length ?
        <div>No problems Found</div>
        :
        <ul>
        {
          problems.map(
            (oneProblem) => (
              <li key={oneProblem.id}>

                <button onClick={() => navigate(`/oneProblems/${oneProblem.id}`)} >
                    {oneProblem.title}
                    <br/>
                    {oneProblem.user?.username || 'Unknown'}||<VoteButton problemId={oneProblem.id} />

                </button>
                
              </li>
            )
          )
        }
        </ul>}
    </div>
  )
}

export default ProblemList
