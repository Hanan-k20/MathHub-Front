import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as problemService from '../../services/problemService';
import Swal from 'sweetalert2';
import './problemForm.css';
import 'mathlive';

function ProblemForm({ updateProblem, problemToUpdate, updateOneProblem }) {
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const mathRef = useRef(null);

  const [formState, setFormState] = useState({
    title: "",
    equation_LaTeX: ""
  });

  useEffect(() => {
    const loadData = async () => {
      if (problemId && !problemToUpdate) {
        try {
          const data = await problemService.show(problemId);
          setFormState(data);
          if (mathRef.current) {
            mathRef.current.setValue(data.equation_LaTeX || '');
          }
        } catch (error) {
          console.error(error);
        }
      } else if (problemToUpdate) {
        setFormState(problemToUpdate);
        if (mathRef.current) {
          mathRef.current.setValue(problemToUpdate.equation_LaTeX || '');
        }
      }
    };
    loadData();
  }, [problemId, problemToUpdate]);

  useEffect(() => {
    const mf = mathRef.current;
    if (mf) {
      mf.smartMode = true;
      const syncHeight = () => {
        mf.style.height = 'auto';
        mf.style.height = (mf.scrollHeight > 100 ? Math.min(mf.scrollHeight, 300) : 100) + 'px';
      };

      mf.addEventListener('input', (evt) => {
        setFormState(prev => ({ ...prev, equation_LaTeX: evt.target.value }));
        syncHeight();
      });

      mf.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          mf.executeCommand(['insert', '\\\\']);
          setTimeout(syncHeight, 10);
        }
      });
      setTimeout(syncHeight, 100);
    }
  }, []);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    
    const currentMathValue = mathRef.current ? mathRef.current.value : formState.equation_LaTeX;

    if (!currentMathValue || !formState.title) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    const finalData = {
      title: formState.title,
      equation_LaTeX: currentMathValue
    };

    setLoading(true);
    try {
      if (problemId) {
        await updateOneProblem(problemId, finalData);
        Swal.fire('Updated!', 'Your changes have been saved.', 'success');
      } else {
        await updateProblem(finalData);
        Swal.fire('Saved!', 'New problem added.', 'success');
      }
      navigate('/problems');
    } catch (error) {
      Swal.fire('Error', 'Action failed. Please check connection.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container-full">
      <div className="problem-form-card">
        <h1>{problemId ? 'Edit Task' : 'New Question'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Topic Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formState.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Mathematical Notation</label>
            <div className="math-input-wrapper">
              <math-field
                ref={mathRef}
                smart-mode="true"
                virtual-keyboard-mode="onfocus"
                multiline="true"
              ></math-field>
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (problemId ? 'Update Changes' : 'Submit Question')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProblemForm;