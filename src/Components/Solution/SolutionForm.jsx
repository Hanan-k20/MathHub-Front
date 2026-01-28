import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as solutionService from '../../services/solutionService'
import 'mathlive';
import './solutionForm.css'
import Swal from 'sweetalert2';

function SolutionForm({ updateSolution }) {
    const navigate = useNavigate()
    const { problemId, solutionId } = useParams()
    const mathRef = useRef(null);

    const [formState, setFormState] = useState({
        content: ''
    })

    useEffect(() => {
        const solutionEdit = async () => {
            if (!solutionId) return
            const latest = await solutionService.show(solutionId)
            if (latest) {
                setFormState(latest);
                // تحديث الارتفاع بعد تحميل البيانات لمنع التداخل
                setTimeout(() => {
                    if (mathRef.current) {
                        mathRef.current.style.height = 'auto';
                        mathRef.current.style.height = Math.min(mathRef.current.scrollHeight, 350) + 'px';
                    }
                }, 100);
            }
        }
        solutionEdit()
    }, [solutionId])

    useEffect(() => {
        const mf = mathRef.current;
        if (mf) {
            mf.smartMode = true;

            const syncHeight = () => {
                if (mf) {
                    mf.style.height = 'auto';
                    const newHeight = mf.scrollHeight;
                    mf.style.height = (newHeight > 120 ? Math.min(newHeight, 350) : 120) + 'px';
                }
            };

            mf.addEventListener('input', syncHeight);

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

    const handleMathChange = (event) => {
        setFormState({ ...formState, content: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            if (solutionId) {
                const updatedSolution = await solutionService.update(solutionId, formState);
                if (updatedSolution) navigate(`/problems/${problemId}`)
            } else {
                const data = await solutionService.create(problemId, formState);
                if (data) {
                    updateSolution(data, problemId);
                    navigate(`/problems/${problemId}`)
                }
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error", text: error.message })
        }
    };

    return (
        <main className="sol-page-container">
            <div className="sol-form-card">
                <header className="sol-form-header">
                    <h1>{solutionId ? 'Edit Solution' : 'Add Solution'}</h1>
                    <p>Use the math keyboard to write your steps.</p>
                </header>

                <form onSubmit={handleSubmit} className="sol-math-form">
                    <div className="sol-input-group">
                        <label className="sol-label">Your Mathematical Solution</label>
                        <div className="sol-math-field-wrapper">
                            <math-field
                                ref={mathRef}
                                onInput={handleMathChange}
                                smart-mode="true"
                                virtual-keyboard-mode="onfocus"
                                value={formState.content}
                                multiline="true"
                            ></math-field>
                        </div>
                    </div>

                    <div className="sol-actions-group">
                        <button type="submit" className="sol-btn-submit">
                            {solutionId ? 'Update' : 'Post'} Solution
                        </button>
                        <button type="button" className="sol-btn-cancel" onClick={() => navigate(`/problems/${problemId}`)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

export default SolutionForm;