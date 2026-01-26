
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/problems`

const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

// retrieve all 
const index = async () => {
    try {
        const response = await axios.get(BASE_URL, authConfig())
        return response.data
    } catch (err) {
        console.log(err)
    }
}

// retrieve ONE problem
const show = async (problemId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${problemId}`, authConfig())
        return response.data.problem
    } catch (error) {
        console.log(error)
    }
}

// create new problem
const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, authConfig())

        return response.data.problem
    } catch (error) {
        console.log(error)
    }
}

// edit problems
const update = async (problemId, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${problemId}`, formData, authConfig())

        return response.data.problem
    } catch (error) {
        console.log(error)
    }
}

// delete problems
const remove = async (problemId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${problemId}`, authConfig())

        return response.data.problem
    } catch (error) {
        console.log(error)
    }
}
export {
    index,
    show,
    create,
    update,
    remove
}