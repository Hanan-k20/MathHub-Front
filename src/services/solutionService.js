import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/solutions`

const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

const index = async () => {
    try {
        const response = await axios.get(BASE_URL, authConfig())
        return response.data.solutions
    } catch (err) {
        console.log(err)
    }
}

const show = async (solutionId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${solutionId}`, authConfig())
        return response.data.solutions
    } catch (error) {
        console.log(error)
    }
}

const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, authConfig())

        return response.data.solutions
    } catch (error) {
        console.log(error)
    }
}

const update = async (solutionId, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${solutionId}`, formData, authConfig())

        return response.data.solutions
    } catch (error) {
        console.log(error)
    }
}

const remove = async (solutionId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${solutionId}`, authConfig())

        return response.data.solutions
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