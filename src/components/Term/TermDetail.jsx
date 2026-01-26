import { useState, useEffect } from "react"
import * as termService from '../../services/termService'
import { useNavigate, useParams ,Link} from "react-router";

function TermDetail({findTermToUpdate,deleteTerm}) {

  const [term,setTerm] = useState(null)
  const {id}=useParams()
  const navigate=useNavigate()
  useEffect(
    ()=>{
    const getOneTerm = async(id)=>{
    const term = await termService.show(id)
    setTerm(term)
  }
 if(id) getOneTerm(id)
},[id])


const handleDelete =async()=>{
  try {
      const deletTerm=await termService.deleteOne(id)
      deletTerm(id)
      navigate('/')
  } catch (error) {
        console.log('something went wrong')

  }
}
  if(!id) return <h1>Loading...</h1>
  if(!term) return <h1>Loading...</h1>

  return (
    <div>
      <h1>Name:{term.name}</h1>
      <h3>Definition:{term.definition}</h3>
      <p>Example:{term.example}</p>
      <p>Category:{term.category}</p>
      <p>Created by::{term.created_At}</p>

      <div>
        <Link onClick={()=>  findTermToUpdate(id) } to={`/terms/${id}/update`}>Edit</Link>
        <br/>
        <button onClick={handleDelete}>Delete</button>
      </div>
       </div>
  )
}

export default TermDetail
