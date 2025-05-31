import React, {useContext, useState} from 'react';
import {assets} from "../../assets/assets.js";
import {StoreContext} from "../../context/StoreContext.jsx";
import {calculateCartTotal} from "../../util/cartUtils.js";
import {createOrder, getOrderBillText} from "../../service/orderService.js";
import {useNavigate} from "react-router-dom";
import {useLoading} from "../../context/LoadingContext.jsx";

const PlaceOrder = () => {
    const navigate = useNavigate();
    const loadingContext = useLoading();
    const [validated, setValidated] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [billText, setBillText] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("CARD");

    const {foodList, quantities, clearCartItems, userId} = useContext(StoreContext);
    // cart items
    const cartItems = foodList.filter(food => quantities[food.id] > 0);

    //calculating
    const {subtotal, shipping, tax, total} = calculateCartTotal(
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
                paymentDetails: paymentMethod === "CARD" ? {
                    method: "CARD",
                    cardNumber: form.cardNumber.value,
                    cardExpiry: form.cardExpiry.value,
                    cardCvv: form.cardCvv.value,
                    cardName: form.cardName.value
                } : {
                    method: "UPI",
                    upiId: form.upiId.value
                },
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
            const text = await getOrderBillText(order.id);
            setBillText(text);

            // Clear the cart
            await clearCartItems();

            // Navigate to success page
            navigate('/order-success', { state: { orderId: order.id, billText: text } });
        } catch (error) {
            console.error("Error creating order:", error);
            setOrderError("Failed to create order. Please try again.");
        }
    };

    return (
        <div id="checkout-form">
            <div className="container py-2">
                <div className="py-2 text-center">
                    <img className="d-block mx-auto mb-1"
                         src={assets.payment} alt="image" width="98"
                         height="98"/>
                </div>

                <form
                    className={`needs-validation ${validated ? "was-validated" : ""}`}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    {orderError && (
                        <div className="alert alert-danger" role="alert">
                            {orderError}
                        </div>
                    )}

                    <div className="row gy-4 gx-lg-5">
                        {/* Billing Details - Left Side */}
                        <div className="col-12 col-md-7">
                            <div className="bg-light rounded p-4 shadow-sm h-100">
                                <h3 className="mb-4 fw-bold">Billing Details</h3>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="firstName" name="firstName" placeholder={"John"}
                                               required/>
                                        <div className="invalid-feedback">First name is required.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" name="lastName" placeholder={"Doe"}
                                               required/>
                                        <div className="invalid-feedback">Last name is required.</div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" name="email"
                                               placeholder={"you@gmail.com"} required/>
                                        <div className="invalid-feedback">Please provide a valid email.</div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input type="text" className="form-control" id="address" name="address" required/>
                                        <div className="invalid-feedback">Address is required.</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="zip" className="form-label">Zip</label>
                                        <input type="text" className="form-control" id="zip" name="zip" required/>
                                        <div className="invalid-feedback">Zip code is required.</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="locality" className="form-label">Locality</label>
                                        <input type="text" className="form-control" id="locality" name="locality" required/>
                                        <div className="invalid-feedback">Locality is required.</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="landmark" className="form-label">Landmark</label>
                                        <input type="text" className="form-control" id="landmark" name="landmark" required/>
                                        <div className="invalid-feedback">Landmark is required.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <select id="country" name="country" className="form-select" required>
                                            <option value="">Choose...</option>
                                            <option>India</option>
                                        </select>
                                        <div className="invalid-feedback">Please select a country.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="state" className="form-label">State</label>
                                        <select id="state" name="state" className="form-select" required>
                                            <option value="">Choose...</option>
                                            <option>Uttar Pradesh</option>
                                        </select>
                                        <div className="invalid-feedback">Please select a state.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary - Right Side */}
                        <div className="col-12 col-md-5">
                            <div className="bg-light rounded p-4 shadow-sm h-100">
                                <h4 className="mb-3">Payment Summary</h4>

                                <h6 className="fw-semibold mb-3">Items in Cart</h6>
                                {foodList.filter(food => quantities[food.id] > 0).map(food => (
                                    <div
                                        key={food.id}
                                        className="d-flex justify-content-between align-items-start mb-2 p-2 rounded shadow-sm"
                                        style={{ borderLeft: '5px solid #0d6efd', backgroundColor: '#f8f9fa' }}
                                    >
                                        <div>
                                            <div className="fw-bold text-dark" style={{ fontSize: '1rem' }}>{food.name}</div>
                                            <div className="text-primary small mt-1">Qty: {quantities[food.id]}</div>
                                        </div>
                                        <div className="fw-bold text-success" style={{ fontSize: '1rem' }}>
                                            ₹ {(food.price * quantities[food.id]).toFixed(2)}
                                        </div>
                                    </div>
                                ))}

                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Subtotal</span>
                                        <span>₹{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Delivery Fee</span>
                                        <span>₹{shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">GST</span>
                                        <span>₹{tax.toFixed(2)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
                                        <span>Total</span>
                                        <span>₹{total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <h6 className="fw-semibold mb-2">Payment Method</h6>

                                <div className="mb-3">
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="paymentMethodCard" value="CARD" defaultChecked onChange={() => setPaymentMethod("CARD")} />
                                        <label className="form-check-label" htmlFor="paymentMethodCard">Card</label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input className="form-check-input" type="radio" name="paymentMethod" id="paymentMethodUPI" value="UPI" onChange={() => setPaymentMethod("UPI")} />
                                        <label className="form-check-label" htmlFor="paymentMethodUPI">UPI</label>
                                    </div>
                                </div>

                                <div className="row g-2 mb-3">
                                    <div className="col-3">
                                        <img src={assets.razorPay} alt="Razorpay" width={100} height={30} />
                                    </div>
                                </div>

                                {paymentMethod === "CARD" ? (
                                    <>
                                        <input type="text" className="form-control mb-2" id="cardNumber" name="cardNumber" placeholder="Card Number" required={paymentMethod === "CARD"}/>
                                        <div className="row g-2 mb-2">
                                            <div className="col">
                                                <input type="text" className="form-control" id="cardExpiry" name="cardExpiry" placeholder="MM/YY" required={paymentMethod === "CARD"}/>
                                            </div>
                                            <div className="col">
                                                <input type="text" className="form-control" id="cardCvv" name="cardCvv" placeholder="CVV" required={paymentMethod === "CARD"}/>
                                            </div>
                                        </div>
                                        <input type="text" className="form-control mb-3" id="cardName" name="cardName" placeholder="Name on Card" required={paymentMethod === "CARD"}/>
                                    </>
                                ) : (
                                    <input type="text" className="form-control mb-3" id="upiId" name="upiId" placeholder="UPI ID (e.g., name@upi)" required={paymentMethod === "UPI"}/>
                                )}

                                <button type="submit"
                                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                        disabled={loadingContext.getLoadingState('createOrder') || cartItems.length === 0}>
                                    {loadingContext.getLoadingState('createOrder') ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">payments</span>
                                            Place Order
                                        </>
                                    )}
                                </button>

                                <p className="text-muted small text-center mt-3">
                                    By placing your order, you agree to our{" "}
                                    <a href="#" className="text-decoration-underline">Terms of Service</a> and{" "}
                                    <a href="#" className="text-decoration-underline">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PlaceOrder;
