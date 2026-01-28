import axios from "axios";
import { setLoadingContext as setFoodLoadingContext } from "./foodService.js";
import { backendUrl } from "../assets/assets.js";

const API_URL = `${backendUrl}/api/v1/payment`;

// This function will be used to get the loading context in a non-React environment
let loadingContextValue = null;
export const setLoadingContext = (context) => {
    loadingContextValue = context;
    // Also set the loading context for foodService (or base service) if needed
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

// Initiate a payment (Wraps Order Creation)
export const initiatePayment = withLoading('initiatePayment', async (orderData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${API_URL}/initiate`, orderData, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to initiate payment:", error);
        throw error;
    }
});

// Verify a payment
export const verifyPayment = withLoading('verifyPayment', async (paymentData) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${API_URL}/verify`, paymentData, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to verify payment:", error);
        throw error;
    }
});

// Get payment status
export const getPaymentStatus = withLoading('getPaymentStatus', async (paymentId) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${API_URL}/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to get payment status:", error);
        throw error;
    }
});

// Retry a failed payment
export const retryPayment = withLoading('retryPayment', async (orderId, amount) => {
    try {
        const token = localStorage.getItem('authToken');
        const response = await axios.post(`${API_URL}/retry`, {
            orderId,
            amount
        }, {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to retry payment:", error);
        throw error;
    }
});
