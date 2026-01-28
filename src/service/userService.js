import axios from 'axios';
import { backendUrl } from '../assets/assets.js';

// Base API URL is imported from assets, assuming it points to the root API or auth base.
// Adjusting paths based on conventional REST usage derived from existing codebase context.

const updateUserProfile = async (token, userData) => {
    try {
        const response = await axios.put(`${backendUrl}/api/v1/users/profile`, userData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const changeUserPassword = async (token, passwordData) => {
    try {
        const response = await axios.post(`${backendUrl}/api/v1/users/change-password`, passwordData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const userService = {
    updateUserProfile,
    changeUserPassword
};
