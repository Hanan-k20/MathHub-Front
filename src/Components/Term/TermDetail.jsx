import { useState, useEffect, useContext } from "react"
import * as termService from '../../services/termService'
import { UserContext } from '../../contexts/UserContext';
import { useNavigate, useParams, Link } from "react-router";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Swal from 'sweetalert2';
import './termDetail.css'; 

function TermDetail({ findTermToUpdate, deleteTerm }) {
    const { user } = useContext(UserContext)
    const [term, setTerm] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()
    const config = {
        loader: { load: ["input/tex", "output/chtml"] },
        tex: {
            inlineMath: [["$", "$"], ["\\(", "\\)"]],
            displayMath: [["$$", "$$"], ["\\[", "\\]"]],
            macros: {
                imaginaryI: "i",
                placeholder: "\\square",
                RR: "{\\bf R}",
            }
        }
    };

    useEffect(() => {
        const getOneTerm = async (id) => {
            const term = await termService.show(id)
            setTerm(term)
        }
        if (id) getOneTerm(id)
    }, [id])

    const cleanMath = (text) => {
        if (!text) return "";
        return text.replace(/\\imaginaryI/g, 'i').replace(/\\placeholder/g, '\\square');
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await termService.remove(id)
                deleteTerm(id)
                navigate('/terms')
            } catch (error) {
                Swal.fire('Error', 'Something went wrong', 'error');
            }
        }
    }

    if (!term) return <div className="detail-modal-overlay"><h1>Loading...</h1></div>

    return (
        <MathJaxContext config={config} version={3}>
            <div className="detail-modal-overlay">
                <div className="detail-card">
                    <h1 className="detail-title">{term.name}</h1>

                    <div className="info-block">
                        <h3 className="section-label">Definition:</h3>
                        <div className="math-display">
                            <MathJax>{`$$ ${cleanMath(term.definition)} $$`}</MathJax>
                        </div>
                    </div>

                    <div className="info-block">
                        <h3 className="section-label">Example:</h3>
                        <div className="math-display">
                            <MathJax>{`$$ ${cleanMath(term.example)} $$`}</MathJax>
                        </div>
                    </div>

                    <div className="detail-meta">
                        <span><strong>Category:</strong> {term.category}</span>
                        <span><strong>Owner:</strong> {term.user?.username}</span>
                        <span><strong>Created:</strong> {new Date(term.created_At).toLocaleDateString()}</span>
                    </div>

                    <div className="detail-actions">
                        {(user?.sub === String(term.user_id) || user?.username === term.user?.username) && (
                            <div className="admin-controls">
                                <Link onClick={() => findTermToUpdate(id)} to={`/terms/${id}/update`} className="btn-edit">
                                    📝 Edit Term
                                </Link>
                                <button onClick={handleDelete} className="btn-delete">
                                    🗑️ Delete Term
                                </button>
                            </div>
                        )}
                        <button onClick={() => navigate('/terms')} className="btn-back">
                            ← Back to Dictionary
                        </button>
                    </div>
                </div>
            </div>
        </MathJaxContext>
    );
}

export default TermDetail;