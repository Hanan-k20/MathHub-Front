import { useState, useEffect } from "react"
import * as termService from '../../services/termService'
import { useNavigate, useParams, Link } from "react-router";
import MathJax from 'react-mathjax2';

function TermDetail({ findTermToUpdate, deleteTerm }) {

    const [term, setTerm] = useState(null)
    const { id } = useParams()
    const navigate = useNavigate()
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
        <MathJax.Context >
            <h1>Name:{term.name}</h1>
            <div>
                <MathJax.Text><h3>Definition:{term.definition}</h3></MathJax.Text>
                <MathJax.Text><p>Example:{term.example}</p></MathJax.Text>
                <p>Category:{term.category}</p>
                <p>Created by::{term.created_At}</p>

                <div>
                   {term.user_id === user?.id && (
                        <div style={{ marginTop: '20px' }}>
                            <Link 
                                onClick={() => findTermToUpdate(id)} 
                                to={`/terms/${id}/update`}
                                style={{ marginRight: '15px', color: '#007bff', fontWeight: 'bold' }}
                            >
                                📝 Edit Term
                            </Link>
                            <button 
                                onClick={handleDelete}
                                style={{ background: 'none', border: 'none', color: '#d33', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                🗑️ Delete Term
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </MathJax.Context>
    )
}

export default TermDetail
