import React, { useContext, useState } from 'react';
import { assets } from "../../assets/assets.js";
import { StoreContext } from "../../context/StoreContext.jsx";
import { calculateCartTotal } from "../../util/cartUtils.js";
import { getOrderBillText } from "../../service/orderService.js";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext.jsx";
import { toast } from "react-toastify";

const PlaceOrder = () => {
    const navigate = useNavigate();
    const loadingContext = useLoading();
    const [validated, setValidated] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [paymentProcessing, setPaymentProcessing] = useState(false); // New state for full screen loader

    // Add state for billing details to support autofill
    const [billingValues, setBillingValues] = useState({
        firstName: '', lastName: '', email: '',
        address: '', zip: '', locality: '', landmark: '',
        country: '', state: ''
    });

    const { foodList, quantities, clearLocalCart, userId, initiatePayment, verifyPayment } = useContext(StoreContext);
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
                setBillingValues(prev => ({
                    ...prev,
                    address: `Lat: ${position.coords.latitude.toFixed(4)}, Long: ${position.coords.longitude.toFixed(4)}`, // Fallback
                    locality: "Detected Locality",
                    zip: "000000"
                }));
            }, function (error) {
                console.error("Error getting location:", error);
            });
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
        setPaymentProcessing(true); // Start full screen loader
        setOrderError(null);

        try {

            // 1. Initiate Payment (Secure Backend-Driven)
            // We only send the intent and billing details. Backend calculates amount.
            const orderData = {
                userId: userId,
                // items: [], // Backend uses cart items when useCart is true
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
                paymentMode: "RAZORPAY",
                useCart: true
            };

            const orderResponse = await initiatePayment(orderData);

            if (!orderResponse || !orderResponse.orderId || !orderResponse.razorpayOrderId) {
                console.error("Invalid Order Response:", orderResponse);
                throw new Error("Failed to initiate payment. Invalid server response.");
            }

            // 2. Open Razorpay Options
            const keyId = orderResponse.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
            if (!keyId) {
                toast.error("Payment Configuration Error: Key ID missing.");
                setPaymentProcessing(false);
                return;
            }

            // Backend returns totalAmountWithGST in Rupees. Razorpay expects paise.
            // If totalAmountWithGST is missing, we must fail secure (don't fallback to frontend total).
            if (typeof orderResponse.totalAmountWithGST !== 'number') {
                throw new Error("Invalid payment amount received from server.");
            }
            const razorpayAmount = Math.round(orderResponse.totalAmountWithGST * 100);

            const options = {
                key: keyId,
                amount: razorpayAmount,
                currency: "INR",
                name: "ZaikaBox",
                description: "Order Payment",
                image: assets.logo,
                order_id: orderResponse.razorpayOrderId,
                handler: async function (response) {
                    // Keep loader active or re-activate if needed during verification
                    setPaymentProcessing(true);
                    try {
                        console.log("Razorpay SDK Success Response:", response);

                        const verifyPayload = {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            orderId: orderResponse.orderId
                        };

                        // 3. Verify Payment
                        const verifyResult = await verifyPayment(verifyPayload);

                        if (verifyResult && (
                            verifyResult.success === true ||
                            verifyResult.status === "COMPLETED" ||
                            verifyResult.status === "PAID" ||
                            verifyResult.orderStatus === "PAID" ||
                            verifyResult.orderStatus === "PENDING" ||
                            verifyResult.razorpayPaymentId
                        )) {
                            const finalOrderId = verifyResult.orderId || orderResponse.orderId;
                            let text = "";
                            try {
                                text = await getOrderBillText(finalOrderId);
                            } catch (billError) {
                                console.warn("Could not fetch bill text, proceeding anyway:", billError);
                            }

                            // Use clearLocalCart because backend already clears the DB cart on secure verification
                            clearLocalCart();

                            // Navigate will unmount component, so state update warning might occur if not handled, but here fine.
                            navigate('/orders', { state: { orderId: finalOrderId, billText: text, showReceipt: true } });
                            toast.success("Order placed successfully!");
                        } else {
                            console.error("Verification Condition Failed. verifyResult:", verifyResult);
                            toast.error("Payment verification status unknown. Please check your Orders.");
                            setPaymentProcessing(false);
                        }
                    } catch (err) {
                        console.error("Verification error in handler:", err);
                        toast.error("Payment verification failed: " + (err.response?.data?.message || err.message));
                        setPaymentProcessing(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        setPaymentProcessing(false); // Disable loader if user closes modal
                    }
                },
                prefill: {
                    name: `${billingValues.firstName} ${billingValues.lastName}`,
                    email: billingValues.email,
                    contact: ""
                },
                theme: {
                    color: "#tomato"
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error("Payment Failed: " + response.error.description);
                setPaymentProcessing(false);
            });
            rzp1.open();
            // Note: We do NOT setPaymentProcessing(false) here immediately.
            // We want the loader to persist until the modal visually opens. 
            // However, Razorpay SDK doesn't have an 'opened' event.
            // Standard practice: Keep it loading, or use a timeout to remove it if you just want to cover initialization.
            // Since ondismiss handles user closing, and handler handles success, we can leave it true.

        } catch (error) {
            console.error("Error placing order:", error);
            setOrderError("Failed to initiate payment. Please try again.");
            setPaymentProcessing(false);
        }
    };

    if (paymentProcessing) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100 bg-white" style={{ zIndex: 9999, opacity: 0.95 }}>
                <div className="spinner-grow text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-secondary fw-bold">Securely contacting Razorpay...</h4>
                <p className="text-muted small">Please do not refresh the page or go back.</p>
                <img src={assets.razorPay} alt="Razorpay" height="24" className="mt-4" style={{ opacity: 0.8 }} />
            </div>
        );
    }

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
                                        <label className={`card p-3 border cursor-pointer transition-all border-primary bg-primary-subtle`} style={{ cursor: 'pointer' }}>
                                            <div className="d-flex align-items-center">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="paymentMethod" id="razorpay" value="RAZORPAY" defaultChecked />
                                                </div>
                                                <div className="ms-3 flex-grow-1">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <span className="fw-semibold text-dark">Online Payment</span>
                                                        <img src={assets.razorPay || "https://razorpay.com/assets/razorpay-glyph.svg"} alt="Razorpay" height="24" />
                                                    </div>
                                                    <small className="text-muted d-block">Cards, UPI, NetBanking (via Razorpay)</small>
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
