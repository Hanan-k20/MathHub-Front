import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import * as problemService from '../../services/problemService';
import Swal from 'sweetalert2';
import'./problemForm.css'
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
        <div className="form-container-full">
            <div className="problem-form-card">
                <h1>{problemToUpdate ? 'Edit Task' : 'New Question'}</h1>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Topic Title</label>
                        <input
                            type="text"
                            name="title" 
                            id="title"
                            placeholder="What are we solving today?"
                            value={formState.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mathematical Notation</label>
                        <math-field
                            onInput={evt => setFormState({ ...formState, equation_LaTeX: evt.target.value })}
                        >
                            {formState.equation_LaTeX}
                        </math-field>
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? '🤖 AI Processing...' : 'Submit Equation'}
                    </button>

                    {loading && (
                        <div className="ai-loading-status">
                            ✨ AI is formulating the perfect solution...
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ProblemForm;