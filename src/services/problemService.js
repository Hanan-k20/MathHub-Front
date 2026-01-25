import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/problems`;

// GET ALL ==================================================================================================
const index = async () => {
    try {
        const response = await axios.get(BASE_URL);
        console.log(response.data)
        return response.data.problems; 
    } catch (error) {
        console.error(error);
       
    }
};

// GET ONE ==================================================================================================
const show = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
         return response.data.problem;  
    } catch (error) {
        console.error(error);
      
    }
};

// CREATE ==================================================================================================
const create = async (formData) => {
    try {
        const response = await axios.post(BASE_URL, formData);
        return response.data.problem;
    } catch (error) {
        console.error(error);
       
    }
};

// UPDATE ==================================================================================================
const update = async (problemId, formData) => {
    try {
        const response = await axios.put(`${BASE_URL}/${problemId}`, formData);
        return response.data.problem;
    } catch (error) {
        console.error(error);
       
    }
};

// DELETE ==================================================================================================
const deleteOne = async (problemId) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${problemId}`);
        return response.data; 
    } catch (error) {
        console.error(error);
     
    }
};

export {
    index,
    show,
    create,
    update,
    deleteOne,
};
