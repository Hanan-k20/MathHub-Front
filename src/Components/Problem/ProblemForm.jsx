import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import * as problemService from '../../services/problemService';
import Swal from 'sweetalert2';
import './problemForm.css'
import 'mathlive';

function ProblemForm({ updateProblem, problemToUpdate, updateOneProblem }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const mathRef = useRef(null); // المرجع للحقل الرياضي

  const [formState, setFormState] = useState(
    problemToUpdate ? problemToUpdate : { title: "", equation_LaTeX: '' }
  );

  // تأثير لضبط إعدادات Mathfield والتحكم في الارتفاع
  useEffect(() => {
    const mf = mathRef.current;
    if (mf) {
      mf.smartMode = true;

      const syncHeight = () => {
        mf.style.height = 'auto';
        const newHeight = mf.scrollHeight;
        // نضمن أن الحقل لا يقل عن 100px ولا يزيد عن 300px قبل ظهور السكرول
        mf.style.height = (newHeight > 100 ? Math.min(newHeight, 300) : 100) + 'px';
      };

      mf.addEventListener('input', syncHeight);

      // التعامل مع ضغط Enter لعمل سطر جديد بدون رموز مائلة
      mf.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          mf.executeCommand(['insert', '\\\\']); 
          setTimeout(syncHeight, 10);
        }
      });

      // مزامنة أولية
      setTimeout(syncHeight, 100);
    }
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!formState.equation_LaTeX) {
      Swal.fire('Error', 'Equation is required', 'error');
      return;
    }

    setLoading(true);
    try {
      if (problemToUpdate) {
        const updatedProblem = await problemService.update(problemToUpdate.id, formState);
        if (updatedProblem) {
          updateOneProblem(updatedProblem);
          navigate(`/problems/${updatedProblem.id}`);
        }
      } else {
        const newProblemCreated = await problemService.create(formState);
        if (newProblemCreated) {
          updateProblem(newProblemCreated);
          navigate(`/problems/${newProblemCreated.id}`);
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire('Error', 'Something went wrong', 'error');
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
            <div className="math-input-wrapper">
              <math-field
                ref={mathRef}
                onInput={evt => setFormState({ ...formState, equation_LaTeX: evt.target.value })}
                smart-mode="true"
                virtual-keyboard-mode="onfocus"
                value={formState.equation_LaTeX}
                multiline="true"
              ></math-field>
            </div>
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