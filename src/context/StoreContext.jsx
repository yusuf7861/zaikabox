import { createContext, useEffect, useState } from "react";
import { fetchFoodList } from "../service/foodService.js";
import { getCart, addItemToCart, updateCart, removeItemFromCart, clearCart, setLoadingContext, getCartItemCount } from "../service/cartService.js";
import { initiatePayment, verifyPayment, getPaymentStatus, retryPayment } from "../service/paymentService.js";
import { trackOrder, cancelOrder } from "../service/orderService.js";
import { useLoading } from "./LoadingContext.jsx";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
    // Initialize quantities from localStorage if available
    const [quantities, setQuantities] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    const [foodList, setFoodList] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const loadingContext = useLoading();

    // Set the loading context for the cart service
    useEffect(() => {
        setLoadingContext(loadingContext);
    }, [loadingContext]);

    // Check if user is logged in
    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        setIsLoggedIn(!!authToken);

        // Listen for changes to localStorage
        const handleStorageChange = (e) => {
            if (e.key === 'authToken') {
                setIsLoggedIn(!!e.newValue);
            }
        };

        // Listen for login event
        const handleLogin = () => {
            const authToken = localStorage.getItem('authToken');
            setIsLoggedIn(!!authToken);
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('login', handleLogin);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('login', handleLogin);
        };
    }, []);

    // Save quantities to localStorage whenever they change
    useEffect(() => {
        if (!isLoggedIn) {
            localStorage.setItem("cart", JSON.stringify(quantities));
        }
    }, [quantities, isLoggedIn]);

    // Fetch the cart from the server
    const fetchCart = async () => {
        if (isLoggedIn) {
            try {
                const cartData = await getCart();
                setCartId(cartData.id);
                setUserId(cartData.userId);

                // Convert the cart items to quantities
                const newQuantities = {};
                Object.entries(cartData.items || {}).forEach(([foodId, quantity]) => {
                    newQuantities[foodId] = quantity;
                });
                // We don't set quantities here directly because we might be in the middle of a merge
                return newQuantities;
            } catch (error) {
                console.error("Failed to fetch cart:", error);
                return {};
            }
        }
        return {};
    };

    // Load data and handle cart merging on login
    useEffect(() => {
        async function loadData() {
            const data = await fetchFoodList();
            setFoodList(data);

            if (isLoggedIn) {
                // User just logged in or page refreshed with token
                const serverQuantities = await fetchCart();
                setQuantities(serverQuantities);

                // Clear any local guest cart to avoid confusion
                localStorage.removeItem("cart");
            }
        }
        loadData();
    }, [isLoggedIn]);


    // Add an item to the cart
    const addQuantity = async (foodId) => {
        // If user is logged in, save to database
        if (isLoggedIn) {
            try {
                const cartData = await addItemToCart(foodId);
                setCartId(cartData.id);
                setUserId(cartData.userId);

                // Update quantities from the response
                const newQuantities = {};
                Object.entries(cartData.items || {}).forEach(([id, quantity]) => {
                    newQuantities[id] = quantity;
                });
                setQuantities(newQuantities);
            } catch (error) {
                console.error("Failed to add item to cart:", error);
                // Fallback to local update if API call fails
                setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
            }
        } else {
            // If user is not logged in, just update local state
            setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
        }
    };

    // Remove an item from the cart (decrease quantity)
    const removeQuantity = async (foodId, removeCompletely = false) => {
        if (isLoggedIn) {
            if (removeCompletely || quantities[foodId] <= 1) {
                try {
                    const cartData = await removeItemFromCart(foodId);
                    setCartId(cartData.id);
                    setUserId(cartData.userId);

                    // Update quantities from the response
                    const newQuantities = {};
                    Object.entries(cartData.items || {}).forEach(([id, quantity]) => {
                        newQuantities[id] = quantity;
                    });
                    setQuantities(newQuantities);
                } catch (error) {
                    console.error("Failed to remove item from cart:", error);
                    // Fallback to local update if API call fails
                    setQuantities((prev) => {
                        const newQuantities = { ...prev };
                        delete newQuantities[foodId];
                        return newQuantities;
                    });
                }
            } else {
                // Decrease quantity
                try {
                    // Create updated cart data
                    // We need userId here. If state is not ready, we might fail.
                    // But removeQuantity is called by user action, so assume loaded.
                    const cartData = {
                        userId: userId,
                        items: {
                            ...quantities,
                            [foodId]: quantities[foodId] - 1
                        }
                    };

                    const updatedCart = await updateCart(cartData);
                    setCartId(updatedCart.id);
                    setUserId(updatedCart.userId);

                    // Update quantities from the response
                    const newQuantities = {};
                    Object.entries(updatedCart.items || {}).forEach(([id, quantity]) => {
                        newQuantities[id] = quantity;
                    });
                    setQuantities(newQuantities);
                } catch (error) {
                    console.error("Failed to update cart:", error);
                    // Fallback to local update if API call fails
                    setQuantities((prev) => ({ ...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
                }
            }
        } else {
            // If user is not logged in, just update local state
            if (removeCompletely || quantities[foodId] <= 1) {
                setQuantities((prev) => {
                    const newQuantities = { ...prev };
                    delete newQuantities[foodId];
                    return newQuantities;
                });
            } else {
                setQuantities((prev) => ({ ...prev, [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0 }));
            }
        }
    };

    // Clear the cart
    const clearCartItems = async () => {
        if (isLoggedIn) {
            try {
                const cartData = await clearCart();
                setCartId(cartData.id);
                setUserId(cartData.userId);
                setQuantities({});
            } catch (error) {
                console.error("Failed to clear cart:", error);
                // Fallback to local update if API call fails
                setQuantities({});
            }
        } else {
            // If user is not logged in, just clear local state
            setQuantities({});
            localStorage.removeItem("cart");
        }
    };

    // Clear local cart state only (used when backend has already cleared the cart)
    const clearLocalCart = () => {
        setQuantities({});
        localStorage.removeItem("cart");
    };

    const contextValue = {
        foodList,
        addQuantity,
        addQuantity,
        removeQuantity,
        clearCartItems,
        clearLocalCart,
        quantities,
        cartId,
        userId,
        isLoggedIn,
        // Exporting service functions for use in components
        initiatePayment,
        verifyPayment,
        getPaymentStatus,
        retryPayment,
        trackOrder,
        cancelOrder,
        getCartItemCount
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};
