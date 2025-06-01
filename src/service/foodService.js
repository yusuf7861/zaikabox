import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/foods";

// This function will be used to get the loading context in a non-React environment
let loadingContextValue = null;
export const setLoadingContext = (context) => {
    loadingContextValue = context;
};

// Higher-order function to wrap API calls with loading state management
const withLoading = (operation, fn) => async (...args) => {
    if (loadingContextValue) {
        loadingContextValue.setLoading(operation, true);
    }

    try {
        const result = await fn(...args);
        return result;
        // eslint-disable-next-line no-useless-catch
    } catch (error) {
        throw error;
    } finally {
        if (loadingContextValue) {
            loadingContextValue.setLoading(operation, false);
        }
    }
};

export const fetchFoodList = withLoading('fetchFoodList', async () => {
    try {
        const response = await axios.get(API_URL);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log("Failed to fetch food list:", error);
        throw error;
    }
});

export const fetchFoodDetails = withLoading('fetchFoodDetails', async (id) => {
    try {
        const response = await axios.get((API_URL + "/" + id));
        return response.data;
    } catch (error) {
        console.log("Failed to fetch food details", error);
        throw error;
    }
});

// TODO: remove console method calls in before getting production
