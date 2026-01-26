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
        try {
            const deletTerm = await termService.remove(id)
            deleteTerm(id)
            navigate('/terms')
        } catch (error) {
            console.log('something went wrong')

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
                    <Link onClick={() => findTermToUpdate(id)} to={`/terms/${id}/update`}>Edit</Link>
                    <br />
                    <button onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </MathJax.Context>
    )
}

export default TermDetail
