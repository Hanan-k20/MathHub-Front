import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as problemService from '../../services/problemService';
import * as termService from '../../services/termService'; 
import Swal from 'sweetalert2';
import 'mathlive'; 


function ProblemForm({ updateProblem, problemToUpdate, updateOneProblem }) {
  
  const navigate = useNavigate();

  // Added term_id to the initial state
  const [formState, setFormState] = useState(
    problemToUpdate ? problemToUpdate : { title: "", equation_LaTeX: '', term_id: '' }
  );

  const [terms, setTerms] = useState([]);

  // Fetch terms to populate the dropdown
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await termService.index();
        setTerms(data);
      } catch (err) {
        console.log("Error fetching terms:", err);
      }
    };
    fetchTerms();
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    const newFormState = { ...formState, [name]: value };
    setFormState(newFormState);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    const payload = { ...formState };
    
    // Simple validation
    if (!payload.equation_LaTeX || !payload.term_id) {
        Swal.fire('Error', 'Equation and Term are required', 'error');
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

        <label htmlFor="term_id">Term</label>
        <select 
            name="term_id" 
            id="term_id" 
            value={formState.term_id} 
            onChange={handleChange}
        >
          <option value="">Select a Term</option>
          {terms.map(term => (
            <option key={term.id} value={term.id}>{term.name}</option>
          ))}
        </select>

        <label htmlFor="equation_LaTeX">Add the question text:</label>
        <div style={{ border: '1px solid #ccc', margin: '10px 0' }}>
            <math-field 
                onInput={evt => setFormState({ ...formState, equation_LaTeX: evt.target.value })}
                style={{ width: '100%', padding: '10px' }}
            >
                {formState.equation_LaTeX}
            </math-field>
        </div>

        <button type="submit">{problemToUpdate ? 'Update Problem' : 'Add Problem'}</button>
      </form>
    </div>
  );
}

export default ProblemForm;