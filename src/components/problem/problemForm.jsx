import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as problemService from '../../services/problemService'
import Swal from 'sweetalert2';

function ProblemForm(props) {
      const{updateProblem ,problemToUpdate,updateOneProblem}=props;
  const navigate=useNavigate()
  const [formState, setFormState] = useState(problemToUpdate?problemToUpdate:{title:"",equation_LaTeX:''})

  const handleChange = (evt) => {
    const { name, value } = evt.target
    const newFormState = { ...formState, [name]: value }
    setFormState(newFormState)
  }
  const handleSubmit = async(evt) => {
    evt.preventDefault()
    const payload={...formState}
    if(problemToUpdate){
      const updateProblem =await problemService.update(problemToUpdate.id, payload)
      if(updateProblem){
       updateOneProblem(updateProblem)
       navigate('/')
       }else{
      console.log("something")
    }
    }else{
    const newProblemCreated=await problemService.create(payload)
    if(newProblemCreated){
      updateProblem(newProblemCreated)
       navigate('/')
    }
    else{
      console.log('something went wrong')
    }}
  }
  return (
    <div>
      <h1>Pet Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Question topic </label>
        <input type="text" name="title" id="title" value={formState.title} onChange={handleChange}/>
        <label htmlFor="equation_LaTeX">Add the question text:</label>
        <input type="textarea" name="equation_LaTeX" id="equation_LaTeX" value={formState.equation_LaTeX} onChange={handleChange}/>
        <button type="submit">{problemToUpdate ? 'Update Problem' : 'Add Problem'}</button>
      </form>
    </div>
  )
}

export default ProblemForm