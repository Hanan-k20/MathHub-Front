import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as problemService from '../../services/problemService';
import Swal from 'sweetalert2';
import 'mathlive'; 


function ProblemForm({ updateProblem, problemToUpdate, updateOneProblem }) {  
  const navigate = useNavigate();

  // Added term_id to the initial state
  const [formState, setFormState] = useState(
    problemToUpdate ? problemToUpdate : { title: "", equation_LaTeX: '' }
  );

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    const newFormState = { ...formState, [name]: value };
    setFormState(newFormState);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const payload = { ...formState };
    
    // Simple validation
    if (!payload.equation_LaTeX) {
        Swal.fire('Error', 'Equation is required', 'error');
        return;
    }

    if (problemToUpdate) {
      const updatedProblem = await problemService.update(problemToUpdate.id, payload);
      if (updatedProblem) {
        updateOneProblem(updatedProblem);
        navigate('/');
      } else {
        console.log("something went wrong during update");
      }
    } else {
      const newProblemCreated = await problemService.create(payload);
      if (newProblemCreated) {
        updateProblem(newProblemCreated);
        navigate('/');
      } else {
        console.log('something went wrong during creation');
      }
    }
  };

  return (
    <div>
      <h1>{problemToUpdate ? 'Edit Problem' : 'New Problem'}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Question topic </label>
        <input 
            type="text" 
            name="title" 
            id="title" 
            value={formState.title} 
            onChange={handleChange} 
        />


        <label htmlFor="equation_LaTeX">Add the question text:</label>
        <div style={{ border: '1px solid #ccc', margin: '10px 0' }}>
            <math-field 
                onInput={evt => setFormState({ ...formState, equation_LaTeX: evt.target.value })}
                style={{ width: '100%', padding: '10px' }}
            >
                {formState.equation_LaTeX}
            </math-field>
        </div>

        <button type="submit">Send Qustion</button>
      </form>
    </div>
  );
}

export default ProblemForm;