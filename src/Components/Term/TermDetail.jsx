import { useState, useEffect, useContext } from "react"
import * as termService from '../../services/termService'
import { UserContext } from '../../contexts/UserContext';
import { useNavigate, useParams, Link } from "react-router";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import Swal from 'sweetalert2';

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
            processEscapes: true
        }
    };
    useEffect(
        () => {
            const getOneTerm = async (id) => {
                const term = await termService.show(id)
                setTerm(term)
            }
            if (id) getOneTerm(id)
        }, [id])


    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the term!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            try {
                await termService.remove(id)
                deleteTerm(id)
                Swal.fire('Deleted!', 'The term has been removed.', 'success');
                navigate('/terms')
            } catch (error) {
                Swal.fire('Error', 'Something went wrong while deleting', 'error');
            }
        }
    }
    if (!id) return <h1>Loading...</h1>
    if (!term) return <h1>Loading...</h1>

    return (
        <MathJaxContext config={config}>
            <div style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', maxWidth: '600px' }}>
                <h1> Titel: {term.name}</h1>

                <hr />

                <MathJax>
                    <div style={{ marginBottom: '15px' }}>
                        <h3>Definition:</h3>
                        <p>{`\\( ${term.definition} \\)`}</p>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <h3>Example:</h3>
                        <p>{`\\( ${term.example} \\)`}</p>
                    </div>
                </MathJax>

                <div style={{ color: '#666', fontSize: '0.9em' }}>
                    <p><strong>Category:</strong> {term.category}</p>
                    <p><strong>Created at:</strong> {term.created_At}</p>
                    <p><strong>Owner:</strong> {term.user?.username}</p>
                </div>

                {(user?.sub === String(term.user_id) || user?.username === term.user?.username) && (<div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <Link
                        onClick={() => findTermToUpdate(id)}
                        to={`/terms/${id}/update`}
                        style={{ marginRight: '15px', color: '#007bff', fontWeight: 'bold' }}
                    >
                        📝 Edit Term
                    </Link>
                    <button onClick={handleDelete} style={{ color: '#d33', cursor: 'pointer' }}>
                        🗑️ Delete Term
                    </button>
                </div>
                )}
            </div>
            <button onClick={() => navigate('/terms')} style={{ marginTop: '10px' }}> Back </button>
        </MathJaxContext>
    );
}

export default TermDetail
