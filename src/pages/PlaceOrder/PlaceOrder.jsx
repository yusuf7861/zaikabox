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
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    // Add state for billing details to support autofill
    const [billingValues, setBillingValues] = useState({
        firstName: '', lastName: '', email: '',
        address: '', zip: '', locality: '', landmark: '',
        country: '', state: ''
    });

    const { foodList, quantities, clearCartItems, userId } = useContext(StoreContext);
    // cart items
    const cartItems = foodList.filter(food => quantities[food.id] > 0);

    //calculating
    const { subtotal, shipping, tax, total } = calculateCartTotal(
        cartItems, quantities
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBillingValues(prev => ({ ...prev, [name]: value }));
    };

    const handleUseMyLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                // Mocking reverse geocoding for now as we don't have an API key
                // In a real app, use Google Maps or OpenStreetMap API here
                setBillingValues(prev => ({
                    ...prev,
                    address: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`, // Fallback
                    locality: "Detected Locality",
                    zip: "000000"
                }));
                // toast.success("Location detected!"); 
            }, function (error) {
                console.error("Error getting location:", error);
                // toast.error("Could not access location.");
            });
        } else {
            // toast.error("Geolocation not supported");
        }
    };

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
                    firstName: billingValues.firstName || form.firstName.value,
                    lastName: billingValues.lastName || form.lastName.value,
                    email: billingValues.email || form.email.value,
                    address: billingValues.address || form.address.value,
                    zip: billingValues.zip || form.zip.value,
                    locality: billingValues.locality || form.locality.value,
                    landmark: billingValues.landmark || form.landmark.value,
                    country: billingValues.country || form.country.value,
                    state: billingValues.state || form.state.value
                },
                paymentDetails: {
                    method: paymentMethod,
                    upiId: form.upiId ? form.upiId.value : ''
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

            // Clear the cart
            await clearCartItems();

            // Navigate to orders page to show receipt
            navigate('/orders', { state: { orderId: order.orderId, billText: text, showReceipt: true } });
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
                                <div className="card-header bg-white p-4 border-bottom-0 d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0 fw-bold text-secondary"><i className="bi bi-geo-alt me-2 text-primary"></i>Delivery Information</h4>
                                </div>
                                <div className="card-body p-4 pt-0">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="firstName" className="form-label text-muted small fw-bold">FIRST NAME</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="firstName" name="firstName" placeholder="John" required
                                                value={billingValues.firstName} onChange={handleInputChange} />
                                            <div className="invalid-feedback">First name is required.</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="lastName" className="form-label text-muted small fw-bold">LAST NAME</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="lastName" name="lastName" placeholder="Doe" required
                                                value={billingValues.lastName} onChange={handleInputChange} />
                                            <div className="invalid-feedback">Last name is required.</div>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="email" className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
                                            <input type="email" className="form-control form-control-lg bg-light border-0" id="email" name="email" placeholder="you@example.com" required
                                                value={billingValues.email} onChange={handleInputChange} />
                                            <div className="invalid-feedback">Please provide a valid email.</div>
                                        </div>

                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label text-muted small fw-bold d-flex justify-content-between">
                                                STREET ADDRESS
                                                <button type="button" onClick={handleUseMyLocation} className="btn btn-link btn-sm p-0 text-primary text-decoration-none fw-bold">
                                                    <i className="bi bi-crosshair me-1"></i>Use My Location
                                                </button>
                                            </label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="address" name="address" placeholder="123 Main St" required
                                                value={billingValues.address} onChange={handleInputChange} />
                                            <div className="invalid-feedback">Address is required.</div>
                                        </div>

                                        <div className="col-md-4">
                                            <label htmlFor="zip" className="form-label text-muted small fw-bold">ZIP CODE</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="zip" name="zip" required
                                                value={billingValues.zip} onChange={handleInputChange} />
                                            <div className="invalid-feedback">Zip code is required.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="locality" className="form-label text-muted small fw-bold">LOCALITY</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="locality" name="locality" required
                                                value={billingValues.locality} onChange={handleInputChange} />
                                            <div className="invalid-feedback">Locality is required.</div>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="landmark" className="form-label text-muted small fw-bold">LANDMARK</label>
                                            <input type="text" className="form-control form-control-lg bg-light border-0" id="landmark" name="landmark" required
                                                value={billingValues.landmark} onChange={handleInputChange} />
                                            <div className="invalid-feedback">Landmark is required.</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="country" className="form-label text-muted small fw-bold">COUNTRY</label>
                                            <select id="country" name="country" className="form-select form-select-lg bg-light border-0" required
                                                value={billingValues.country} onChange={handleInputChange} >
                                                <option value="">Choose...</option>
                                                <option>India</option>
                                            </select>
                                            <div className="invalid-feedback">Please select a country.</div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="state" className="form-label text-muted small fw-bold">STATE</label>
                                            <select id="state" name="state" className="form-select form-select-lg bg-light border-0" required
                                                value={billingValues.state} onChange={handleInputChange} >
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
                                    <h4 className="mb-0 fw-bold">Payment Details</h4>
                                </div>
                                <div className="card-body p-4">

                                    {/* Razorpay-style Payment Options */}
                                    <h6 className="fw-bold text-secondary mb-3">Select Payment Method</h6>

                                    <div className="payment-options d-flex flex-column gap-2 mb-4">
                                        {/* UPI Option */}
                                        <label className={`card p-3 border cursor-pointer transition-all ${paymentMethod === 'UPI' ? 'border-primary bg-primary-subtle' : 'border-light bg-light hover-shadow'}`} style={{ cursor: 'pointer' }}>
                                            <div className="d-flex align-items-center">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="paymentMethod" id="upi" value="UPI"
                                                        checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                                                </div>
                                                <div className="ms-3 flex-grow-1">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="fw-semibold text-dark">UPI</span>
                                                        <img src="https://cdn.iconscout.com/icon/free/png-256/free-upi-2085056-1747946.png" alt="UPI" height="24" />
                                                    </div>
                                                    <small className="text-muted d-block">Google Pay, PhonePe, Paytm</small>
                                                </div>
                                            </div>

                                            {paymentMethod === 'UPI' && (
                                                <div className="mt-3 ps-4 fade-in">
                                                    <input
                                                        type="text"
                                                        className="form-control bg-white"
                                                        name="upiId"
                                                        placeholder="Enter UPI ID (e.g. name@oksbi)"
                                                        required
                                                    />
                                                    <div className="form-text text-muted small">A verification request will be sent to your UPI app.</div>
                                                </div>
                                            )}
                                        </label>

                                        {/* Card Option (Disabled visual) */}
                                        <label className="card p-3 border-light bg-light opacity-50" style={{ cursor: 'not-allowed' }}>
                                            <div className="d-flex align-items-center">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="paymentMethod" disabled />
                                                </div>
                                                <div className="ms-3 flex-grow-1">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="fw-semibold text-muted">Credit / Debit Card</span>
                                                        <div className="d-flex gap-1">
                                                            <i className="bi bi-credit-card-2-front"></i>
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">Temporarily Unavailable</small>
                                                </div>
                                            </div>
                                        </label>
                                    </div>

                                    {/* Order Summary Compact */}
                                    <div className="bg-light rounded-3 p-3 mb-4 border border-dashed">
                                        <h6 className="fw-bold mb-3">Order Summary</h6>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">Subtotal</span>
                                            <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">Delivery Fee</span>
                                            <span className="fw-semibold">₹{shipping.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 small">
                                            <span className="text-muted">GST (18%)</span>
                                            <span className="fw-semibold">₹{tax.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between border-top pt-2 mt-2">
                                            <span className="fw-bold fs-5 text-dark">Payload Amount</span>
                                            <span className="fw-bold fs-5 text-primary">₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button type="submit"
                                        className="btn btn-primary w-100 btn-lg shadow rounded-pill py-3"
                                        disabled={loadingContext.getLoadingState('createOrder') || cartItems.length === 0}>
                                        {loadingContext.getLoadingState('createOrder') ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Processing Secure Payment...
                                            </>
                                        ) : (
                                            <>
                                                Pay ₹{total.toFixed(2)} <i className="bi bi-shield-lock-fill ms-2"></i>
                                            </>
                                        )}
                                    </button>

                                    <div className="text-center mt-3 d-flex justify-content-center align-items-center gap-2">
                                        <img src={assets.razorPay} alt="Razorpay" height="20" style={{ opacity: 0.7 }} />
                                        <small className="text-muted border-start ps-2">Trusted Payment Partner</small>
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
