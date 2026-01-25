import axios from "axios"

const BASE_URL = import.meta.env.VITE_BACK_END_SERVER_URL

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

 const submitvote = async (problemId, solutionId) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("User is not authenticated")


  const res = await axios.post(`${BASE_URL}/problems/${problemId}/solutions/${solutionId}/votes`,{}, authConfig())
  return res.data
}

  const getvote =async (problemId, solutionId) => {
  const res = await axios.get(`${BASE_URL}/problems/${problemId}/solutions/${solutionId}/votes`, authConfig())
  return res.data
}

export {
  submitvote,
  getvote
}
