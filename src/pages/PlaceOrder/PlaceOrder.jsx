import React, { useContext, useState } from 'react';
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.jsx";
import { calculateCartTotal } from "../../util/cartUtils.js";
import { createOrder, getOrderBillText } from "../../service/orderService.js";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext.jsx";

const PlaceOrder = () => {
    const navigate = useNavigate();
    const loadingContext = useLoading();
    const [validated, setValidated] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [billText, setBillText] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const { foodList, quantities, clearCartItems, userId } = useContext(StoreContext);
    // cart items
    const cartItems = foodList.filter(food => quantities[food.id] > 0);

    //calculating
    const { subtotal, shipping, tax, total } = calculateCartTotal(
        cartItems, quantities
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!form.checkValidity()) {
            event.stopPropagation();
            setValidated(true);
            return;
        }

        setValidated(true);

        try {
            // Create order data from form and cart
            const orderData = {
                userId: userId,
                items: cartItems.map(item => ({
                    foodId: item.id,
                    name: item.name,
                    quantity: quantities[item.id],
                    price: item.price
                })),
                billingDetails: {
                    firstName: form.firstName.value,
                    lastName: form.lastName.value,
                    email: form.email.value,
                    address: form.address.value,
                    zip: form.zip.value,
                    locality: form.locality.value,
                    landmark: form.landmark.value,
                    country: form.country.value,
                    state: form.state.value
                },
                paymentDetails: {
                    method: paymentMethod,
                    upiId: form.upiId.value
                },
                paymentMode: paymentMethod,
                orderSummary: {
                    subtotal,
                    shipping,
                    tax,
                    total
                }
            };

            // Create the order
            const order = await createOrder(orderData);

            // Get the bill text
            const text = await getOrderBillText(order.orderId);
            setBillText(text);

            // Clear the cart
            await clearCartItems();

            // Navigate to orders page
            navigate('/orders', { state: { orderId: order.orderId } });
        } catch (error) {
            console.error("Error creating order:", error);
            setOrderError("Failed to create order. Please try again.");
        }
    };

    return (
        <div id="checkout-form" className="py-5 bg-light min-vh-100" style={{ paddingTop: '100px' }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold text-secondary">Checkout</h2>
                    <p className="text-muted">Complete your order to get your food delivered</p>
                </div>

                <form
                    className={`needs-validation ${validated ? "was-validated" : ""}`}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    {orderError && (
                        <div className="alert alert-danger shadow-sm rounded-3 mb-4" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>{orderError}
                        </div>
                    )}

                    <div className="row gy-4 gx-lg-5">
                        {/* Billing Details - Left Side */}
                        <div className="col-12 col-md-7">
                            <div className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden">
                                <div className="card-header bg-white p-4 border-bottom-0">
                                    <h4 className="mb-0 fw-bold text-secondary"><i className="bi bi-geo-alt me-2 text-primary"></i>Delivery Information</h4>
                                </div>
                                <div className="card-body p-4 pt-0">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="firstName" className="form-label text-muted small fw-bold">FIRST NAME</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="firstName" name="firstName" placeholder="John" required />
                                            <div className="invalid-feedback">First name is required.</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="lastName" className="form-label text-muted small fw-bold">LAST NAME</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="lastName" name="lastName" placeholder="Doe" required />
                                            <div className="invalid-feedback">Last name is required.</div>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="email" className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
                                            <input type="email" className="form-control form-control-lg bg-light border-0" id="email" name="email" placeholder="you@example.com" required />
                                            <div className="invalid-feedback">Please provide a valid email.</div>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label text-muted small fw-bold">STREET ADDRESS</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="address" name="address" placeholder="123 Main St" required />
                                            <div className="invalid-feedback">Address is required.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="zip" className="form-label text-muted small fw-bold">ZIP CODE</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="zip" name="zip" required />
                                            <div className="invalid-feedback">Zip code is required.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="locality" className="form-label text-muted small fw-bold">LOCALITY</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="locality" name="locality" required />
                                            <div className="invalid-feedback">Locality is required.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="landmark" className="form-label text-muted small fw-bold">LANDMARK</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="landmark" name="landmark" required />
                                            <div className="invalid-feedback">Landmark is required.</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="country" className="form-label text-muted small fw-bold">COUNTRY</label>
                                            <select id="country" name="country" className="form-select form-select-lg bg-light border-0" required>
                                                <option value="">Choose...</option>
                                                <option>India</option>
                                            </select>
                                            <div className="invalid-feedback">Please select a country.</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="state" className="form-label text-muted small fw-bold">STATE</label>
                                            <select id="state" name="state" className="form-select form-select-lg bg-light border-0" required>
                                                <option value="">Choose...</option>
                                                <option>Uttar Pradesh</option>
                                            </select>
                                            <div className="invalid-feedback">Please select a state.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary - Right Side */}
                        <div className="col-12 col-md-5">
                            <div className="card border-0 shadow-lg rounded-4 h-100 overflow-hidden">
                                <div className="card-header bg-primary text-white p-4">
                                    <h4 className="mb-0 fw-bold">Order Summary</h4>
                                </div>
                                <div className="card-body p-4">
                                    <div className="mb-4 overflow-auto" style={{ maxHeight: '300px' }}>
                                        {foodList.filter(food => quantities[food.id] > 0).map(food => (
                                            <div
                                                key={food.id}
                                                className="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom"
                                            >
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="position-relative">
                                                        <img src={food.imageUrl} alt={food.name} className="rounded-3 object-fit-cover" width="60" height="60" />
                                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary shadow-sm" style={{ fontSize: '0.6rem' }}>
                                                            {quantities[food.id]}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-0 fw-semibold text-dark">{food.name}</h6>
                                                        <small className="text-muted">₹{food.price} x {quantities[food.id]}</small>
                                                    </div>
                                                </div>
                                                <div className="fw-bold text-dark">
                                                    ₹{(food.price * quantities[food.id]).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-light rounded-3 p-3 mb-4">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Subtotal</span>
                                            <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">Delivery Fee</span>
                                            <span className="fw-semibold">₹{shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="text-muted">GST (18%)</span>
                                            <span className="fw-semibold">₹{tax.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between border-top border-secondary pt-2 mt-2">
                                            <span className="fw-bold fs-5 text-secondary">Total</span>
                                            <span className="fw-bold fs-5 text-primary">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <h6 className="fw-bold text-secondary mb-3">Payment Method</h6>
                                    <div className="mb-4">
                                        <div className="form-check p-3 border rounded-3 mb-2 bg-light">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="paymentMethod"
                                                id="paymentMethodUPI"
                                                value="UPI"
                                                checked={paymentMethod === "UPI"}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-label w-100 fw-semibold cursor-pointer" htmlFor="paymentMethodUPI">
                                                UPI Payment
                                                <i className="bi bi-qr-code-scan float-end text-primary"></i>
                                            </label>
                                        </div>

                                        <input
                                            type="text"
                                            className="form-control form-control-lg bg-light border-0 mt-2"
                                            id="upiId"
                                            name="upiId"
                                            placeholder="Enter UPI ID (e.g. name@upi)"
                                            required={true}
                                        />
                                    </div>

                                    <button type="submit"
                                        className="btn btn-primary w-100 btn-lg shadow rounded-pill"
                                        disabled={loadingContext.getLoadingState('createOrder') || cartItems.length === 0}>
                                        {loadingContext.getLoadingState('createOrder') ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Proceed to Pay <i className="bi bi-arrow-right ms-2"></i>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center mt-3">
                                        <small className="text-muted">
                                            <i className="bi bi-shield-lock-fill me-1"></i>Secure checkout by Razorpay
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaceOrder;
