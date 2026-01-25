import axios from "axios"

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/votes`

const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})

 const submitvote = async (solutionId, formData) => {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("User is not authenticated")

  const payload = {
    solution: solutionId,
    ...formData,
  }

  const res = await axios.post(`${BASE_URL}/${solutionId}`, payload, authConfig())
  return res.data
}

  const getvote = async (solutionId) => {
  const res = await axios.get(`${BASE_URL}/${solutionId}`, authConfig())
  return res.data.allvotes
}

export {
  submitvote,
  getvote
}
