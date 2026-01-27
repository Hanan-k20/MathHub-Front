import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as problemService from '../../services/problemService';
import Swal from 'sweetalert2';
import 'mathlive';


function ProblemForm({ updateProblem, problemToUpdate, updateOneProblem }) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

    if (!payload.equation_LaTeX) {
      Swal.fire('Error', 'Equation is required', 'error');
      return;
    }

    setLoading(true);

    try {
      if (problemToUpdate) {
        const updatedProblem = await problemService.update(problemToUpdate.id, payload);
        if (updatedProblem) {
          updateOneProblem(updatedProblem);
          navigate(`/problems/${updatedProblem.id}`);
        }
      } else {
        const newProblemCreated = await problemService.create(payload);
        if (newProblemCreated) {
          updateProblem(newProblemCreated);
          navigate(`/problems/${newProblemCreated.id}`);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire('Error', 'Something went wrong while communicating with AI', 'error');
    } finally {
      setLoading(false);
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
            value={formState.equation_LaTeX} 
            onInput={evt => setFormState({ ...formState, equation_LaTeX: evt.target.value })}
            style={{ width: '100%', padding: '10px' }}
          >
          </math-field>
        </div>

        <button type="submit" disabled={loading}>
                {loading ? (
                    <span>
                        ⏳ Solving via AI... Please wait
                    </span>
                ) : (
                    'Send Question'
                )}
            </button>

            {loading && (
                <div style={{ marginTop: '10px', color: '#007bff', fontWeight: 'bold' }}>
                    🤖 AI is thinking about the best solution...
                </div>
            )}
      </form>
    </div>
  );
}

export default ProblemForm;