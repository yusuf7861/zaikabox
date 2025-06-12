import axios from "axios";
import { setLoadingContext as setCartLoadingContext } from "./cartService.js";

const API_URL = "http://localhost:8080/api/v1/orders";

// This function will be used to get the loading context in a non-React environment
let loadingContextValue = null;
export const setLoadingContext = (context) => {
    loadingContextValue = context;
    // Also set the loading context for cartService
    setCartLoadingContext(context);
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

// Get the bill for an order in text format
export const getOrderBillText = withLoading('getOrderBillText', async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}/bill/text`, { 
            withCredentials: true,
            responseType: 'text'
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch order bill text:", error);
        throw error;
    }
});

// Get the bill for an order in PDF format
export const getOrderBillPdf = withLoading('getOrderBillPdf', async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}/bill/pdf`, { 
            withCredentials: true,
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch order bill PDF:", error);
        throw error;
    }
});

// Create a new order
export const createOrder = withLoading('createOrder', async (orderData) => {
    try {
        const response = await axios.post(API_URL, orderData, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to create order:", error);
        throw error;
    }
});

// Get an order by ID
export const getOrder = withLoading('getOrder', async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/${orderId}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch order:", error);
        throw error;
    }
});

// Get all orders for the current user
export const getUserOrders = withLoading('getUserOrders', async () => {
    try {
        const response = await axios.get(`${API_URL}`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        throw error;
    }
});

// TODO
// Update an order's status
export const updateOrderStatus = withLoading('updateOrderStatus', async (orderId, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${orderId}/status`, { status }, { 
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to update order status:", error);
        throw error;
    }
});


