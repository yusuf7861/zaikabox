import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/foods";

export const fetchFoodList = async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Failed to fetch food list:", error);
        throw error;
    }
};

export const fetchFoodDetails = async (id) => {
    try {
        const response = await axios.get((API_URL + "/" + id));
        return response.data;
    } catch (error) {
        console.log("Failed to fetch food details", error);
        throw error;
    }
}

// TODO: remove console method calls in before getting production