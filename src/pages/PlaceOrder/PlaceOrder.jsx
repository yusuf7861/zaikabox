import React, {useState} from 'react';
import {assets} from "../../assets/assets.js";


const PlaceOrder = () => {

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <div id="checkout-form">
            <div className="container py-2">
                <div className="py-2 text-center">
                    <img className="d-block mx-auto mb-4"
                         src={assets.logo} alt="company_logo" width="72"
                         height="72"/>
                </div>

                <form
                    className={`needs-validation ${validated ? "was-validated" : ""}`}
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <div className="row gy-4 gx-lg-5">
                        {/* Billing Details - Left Side */}
                        <div className="col-12 col-md-7">
                            <div className="bg-light rounded p-4 shadow-sm h-100">
                                <h3 className="mb-4 fw-bold">Billing Details</h3>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="firstName" className="form-label">First Name</label>
                                        <input type="text" className="form-control" id="firstName" placeholder={"John"}
                                               required/>
                                        <div className="invalid-feedback">First name is required.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastName" className="form-label">Last Name</label>
                                        <input type="text" className="form-control" id="lastName" placeholder={"Doe"}
                                               required/>
                                        <div className="invalid-feedback">Last name is required.</div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email"
                                               placeholder={"you@gmail.com"} required/>
                                        <div className="invalid-feedback">Please provide a valid email.</div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="address" className="form-label">Address</label>
                                        <input type="text" className="form-control" id="address" required/>
                                        <div className="invalid-feedback">Address is required.</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="zip" className="form-label">Zip</label>
                                        <input type="text" className="form-control" id="zip" required/>
                                        <div className="invalid-feedback">Zip code is required.</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="locality" className="form-label">Locality</label>
                                        <input type="text" className="form-control" id="locality" required/>
                                        <div className="invalid-feedback">Locality is required.</div>
                                    </div>
                                    <div className="col-md-4">
                                        <label htmlFor="landmark" className="form-label">Landmark</label>
                                        <input type="text" className="form-control" id="landmark" required/>
                                        <div className="invalid-feedback">Landmark is required.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="country" className="form-label">Country</label>
                                        <select id="country" className="form-select" required>
                                            <option value="">Choose...</option>
                                            <option>India</option>
                                        </select>
                                        <div className="invalid-feedback">Please select a country.</div>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="state" className="form-label">State</label>
                                        <select id="state" className="form-select" required>
                                            <option value="">Choose...</option>
                                            <option>Uttar Pradesh</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary - Right Side */}
                        <div className="col-12 col-md-5">
                            <div className="bg-light rounded p-4 shadow-sm h-100">
                                <h4 className="mb-3">Payment Summary</h4>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Subtotal</span>
                                        <span>$37.96</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Delivery Fee</span>
                                        <span>$3.99</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Tax</span>
                                        <span>$3.42</span>
                                    </div>
                                    <div className="d-flex justify-content-between fw-bold border-top pt-2 mt-2">
                                        <span>Total</span>
                                        <span>$45.37</span>
                                    </div>
                                </div>

                                <h6 className="fw-semibold mb-2">Payment Method</h6>
                                <div className="row g-2 mb-3">
                                    <div className="col-3">
                                        <button className="btn btn-outline-secondary w-100 py-2" type="button">
                                            <i className="fa-brands fa-cc-visa fa-lg"></i>
                                        </button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-secondary w-100 py-2" type="button">
                                            <i className="fa-brands fa-cc-mastercard fa-lg"></i>
                                        </button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-secondary w-100 py-2" type="button">
                                            <i className="fa-brands fa-cc-amex fa-lg"></i>
                                        </button>
                                    </div>
                                    <div className="col-3">
                                        <button className="btn btn-outline-secondary w-100 py-2" type="button">
                                            <i className="fa-brands fa-paypal fa-lg"></i>
                                        </button>
                                    </div>
                                </div>

                                <input type="text" className="form-control mb-2" placeholder="Card Number" required/>
                                <div className="row g-2 mb-2">
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="MM/YY" required/>
                                    </div>
                                    <div className="col">
                                        <input type="text" className="form-control" placeholder="CVV" required/>
                                    </div>
                                </div>
                                <input type="text" className="form-control mb-3" placeholder="Name on Card" required/>

                                <button type="submit"
                                        className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2">
                                    <span className="material-symbols-outlined">payments</span>
                                    Place Order
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