import axios from "axios";
const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/cards`;

export const getCards = async () => {
    const res = await axios.get(BASE_URL);
    return res.data.cards; 
};