
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/terms`

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

// retrieve ONE 
const show = async (termId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${termId}`, authConfig())
        return response.data.term
    } catch (error) {
        console.log(error)
    }
}

// create new
const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData, authConfig())

        return response.data.term
    } catch (error) {
        console.log(error)
    }
}

// edit 
const update = async (termId, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${termId}`, formData, authConfig())

        return response.data.term
    } catch (error) {
        console.log(error)
    }
}

// delete 
const remove = async (termId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${termId}`, authConfig())

        return response.data.term
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