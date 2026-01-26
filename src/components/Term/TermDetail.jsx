import { useState, useEffect } from "react"
import * as termService from '../../services/termService'
import { useNavigate, useParams } from "react-router";
import { Link } from "react-router";

function TermDetail({findTermToUpdate,deleteTerm}) {

    const {findTermToUpdate,deleteTerm}=props
  const [term,setTerm] = useState(null)
  const {id}=useParams()
  const navigate=useNavigate()
  useEffect(
    ()=>{
    const getOneTerm = async(id)=>{
    const term = await termService.show(id)
    setPet(term)
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
      
    </div>
  )
}

export default TermDetail
