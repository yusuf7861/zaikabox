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

// Parse the text bill into a structured object
export const parseBillText = (billText) => {
    if (!billText) return null;
    
    const lines = billText.split('\n');
    const result = {
        orderId: '',
        orderDate: '',
        paymentMode: '',
        status: '',
        items: [],
        subtotal: 0,
        gst: 0,
        gstRate: 0,
        total: 0
    };
    
    // Extract order details
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('Order ID:')) {
            result.orderId = line.replace('Order ID:', '').trim();
        } else if (line.startsWith('Order Date:')) {
            result.orderDate = line.replace('Order Date:', '').trim();
        } else if (line.startsWith('Payment Mode:')) {
            result.paymentMode = line.replace('Payment Mode:', '').trim();
        } else if (line.startsWith('Status:')) {
            result.status = line.replace('Status:', '').trim();
        } else if (line.startsWith('No.') && line.includes('Item') && line.includes('Qty')) {
            // Skip the header and separator lines
            i += 2;
            
            // Parse items until we hit the separator
            while (i < lines.length && !lines[i].startsWith('---') && lines[i].trim() !== '') {
                const itemLine = lines[i].trim();
                const parts = itemLine.split(/\s+/);
                
                if (parts.length >= 5) {
                    const itemNumber = parseInt(parts[0]);
                    const unitPrice = parseFloat(parts[parts.length - 2].replace('$', ''));
                    const total = parseFloat(parts[parts.length - 1].replace('$', ''));
                    const quantity = parseInt(parts[parts.length - 3]);
                    
                    // Extract item name (everything between the item number and quantity)
                    const nameEndIndex = parts.length - 3;
                    const nameStartIndex = 1;
                    const itemName = parts.slice(nameStartIndex, nameEndIndex).join(' ').trim();
                    
                    result.items.push({
                        number: itemNumber,
                        name: itemName,
                        quantity: quantity,
                        unitPrice: unitPrice,
                        total: total
                    });
                }
                
                i++;
            }
        } else if (line.startsWith('Subtotal:')) {
            result.subtotal = parseFloat(line.split('$')[1].trim());
        } else if (line.includes('GST') && line.includes('%')) {
            const gstParts = line.split('(')[1].split(')');
            result.gstRate = parseFloat(gstParts[0].replace('%', '').trim());
            result.gst = parseFloat(line.split('$')[1].trim());
        } else if (line.startsWith('Total:')) {
            result.total = parseFloat(line.split('$')[1].trim());
        }
    }
    
    return result;
};