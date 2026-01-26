import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as solutionService from '../../services/solutionService'
import Swal from 'sweetalert2';

function ProblemDetail(props) {
      const {findProblemToUpdate,deleteProblem}=props
  const [problem,setPet] = useState(null)
  const {id}=useParams()
  const navigate=useNavigate()
  useEffect(
    ()=>{
    const getOneProblem = async(id)=>{
    const problem = await problemService.show(id)
    setPet(problem)
  }
 if(id) getOneProblem(id)
},[id])


const handleDelete =async()=>{
  try {
      const deletProblem=await problemService.deleteOne(id)
      deleteProblem(id)
      navigate('/')
  } catch (error) {
        console.log('something went wrong')

  }
}
  if(!id) return <h1>Loading...</h1>
  if(!problem) return <h1>Loading...</h1>
        
    return (
         <div>
      <h1>Question topic:{problem.title}</h1>
      <h3>{problem.equation_LaTeX}</h3>
      <p>AI Solution:{problem.ai_solution }</p>
      <p>Created at:{problem.created_At }</p>
      <div>
        <Link onClick={()=>  findProblemToUpdate(id) } to={`/problem/${id}/update`}>Edit the question</Link>
        <br/>
        <button onClick={handleDelete}>Delete the question</button>
      </div>
       </div>
        
    )
}

export default ProblemDetail
