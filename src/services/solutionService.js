import axios from "axios";

const API_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;

const authConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
})

const create = async (problemId, formData) => {
    try {
        const response = await axios.post(`${API_URL}/problems/${problemId}/solutions`, formData, authConfig());
        return response.data; 
    } catch (error) {
        console.error("Create Solution Error:", error);
        throw error;
    }
}

const update = async (solutionId, formData) => {
    try {
        const response = await axios.put(`${API_URL}/solutions/${solutionId}`, formData, authConfig());
        return response.data;
    } catch (error) {
        console.error("Update Solution Error:", error);
        throw error;
    }
}

const remove = async (solutionId) => {
    try {
        const response = await axios.delete(`${API_URL}/solutions/${solutionId}`, authConfig());
        return response.data;
    } catch (error) {
        console.error("Delete Solution Error:", error);
        throw error;
    }
}

const show = async (solutionId) => {
    try {
        const response = await axios.get(`${API_URL}/solutions/${solutionId}`, authConfig());
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export {
    create,
    update,
    remove,
    show
}