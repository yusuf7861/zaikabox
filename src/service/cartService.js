import axios from "axios";
import { setLoadingContext as setFoodLoadingContext } from "./foodService.js";

const API_URL = "http://localhost:8080/api/v1/carts";

// This function will be used to get the loading context in a non-React environment
let loadingContextValue = null;
export const setLoadingContext = (context) => {
    loadingContextValue = context;
    // Also set the loading context for foodService
    setFoodLoadingContext(context);
};

// Higher-order function to wrap API calls with loading state management
const withLoading = (operation, fn) => async (...args) => {
    if (loadingContextValue) {
        loadingContextValue.setLoading(operation, true);
    }

    try {
        const result = await fn(...args);
        return result;
    } catch (error) {
        throw error;
    } finally {
        if (loadingContextValue) {
            loadingContextValue.setLoading(operation, false);
        }
    }
};

// Get the current user's cart
export const getCart = withLoading('getCart', async () => {
    try {
        const response = await axios.get(API_URL, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Failed to fetch cart:", error);
        throw error;
    }
});

// Add an item to the cart
export const addItemToCart = withLoading('addItemToCart', async (foodId) => {
    try {
        const response = await axios.post(`${API_URL}/items/${foodId}`, {}, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.log("Failed to add item to cart:", error);
        throw error;
    }
});

// Update the entire cart
export const updateCart = withLoading('updateCart', async (cartData) => {
    try {
        const response = await axios.put(API_URL, cartData, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.log("Failed to update cart:", error);
        throw error;
    }
});

// Remove an item from the cart
export const removeItemFromCart = withLoading('removeItemFromCart', async (foodId) => {
    try {
        const response = await axios.delete(`${API_URL}/items/${foodId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Failed to remove item from cart:", error);
        throw error;
    }
});

// Clear the cart
export const clearCart = withLoading('clearCart', async () => {
    try {
        const response = await axios.delete(API_URL, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.log("Failed to clear cart:", error);
        throw error;
    }
});
