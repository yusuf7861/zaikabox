export const calculateCartTotal = (cartItems, quantities) => {
    //calculate total price
    const subtotal = cartItems.reduce((acc, food) => acc + food.price * quantities[food.id], 0);
    const shipping = 0; // Backend does not charge shipping
    const tax = subtotal * 0.05; // Backend uses 5% GST
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
}