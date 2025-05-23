import React, {useContext} from "react"
import {StoreContext} from "../../context/StoreContext.jsx";
import {Link, useNavigate} from "react-router-dom";

export const Cart = () => {

    const navigate = useNavigate()

    const {foodList, addQuantity, removeQuantity, quantities} = useContext(StoreContext);
    // cart items
    const cartItems = foodList.filter(food => quantities[food.id] > 0);

    //calculate total price
    const subtotal = cartItems.reduce((acc, food) => acc + food.price * quantities[food.id], 0);
    const shipping = subtotal === 0 ? 0.0 : 10;
    const tax = subtotal * 0.1;

    const total = subtotal + shipping + tax;

    return (
        <div id="container">
            <div className="container bg-white rounded shadow-sm p-4">
                <h2 className="h4 fw-bold mb-4">Your Shopping Cart</h2>

                <div className="row g-4">
                    {/* Cart Items */}
                    <div className="col-lg-8">
                        <div className="bg-light rounded p-3 mb-3">
                            {cartItems.length === 0 ? (
                                <div className={"text-center text-muted py-5"}>
                                    <h5>Your cart is empty</h5>
                                    <p className={"small"}>Add some items to your cart to see them here..</p>
                                </div>
                            ) : (
                                <>
                                    {/* Table header for md+ */}
                                    <div className="d-none d-md-flex text-muted fw-semibold border-bottom pb-2 mb-3">
                                        <div className="col-md-6">Product</div>
                                        <div className="col-md-2 text-center">Price</div>
                                        <div className="col-md-2 text-center">Qty</div>
                                        <div className="col-md-2 text-center">Total</div>
                                    </div>

                                    {cartItems.map((item, index) => (
                                        <div key={index} className="border-bottom py-3">
                                            <div className="row align-items-center g-3">
                                                <div className="col-md-6 d-flex align-items-start gap-3">
                                                    <div className="position-relative">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.name}
                                                            className="img-thumbnail"
                                                            style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h6 className="mb-1">{item.name}</h6>
                                                        <small className="text-muted d-block">
                                                            {item.size && `Size: ${item.size}`}{" "}
                                                            {item.color && `| Color: ${item.color}`}
                                                        </small>
                                                        <button
                                                            className="btn btn-link btn-sm text-danger p-0"
                                                            onClick={() => removeQuantity(item.id, true)} // true = full remove
                                                        >
                                                            <i className="bi bi-trash"></i> Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 text-center">
                                                    <span className="d-md-none text-muted me-1">Price:</span>
                                                    ₹{item.price.toFixed(2)}
                                                </div>
                                                <div className="col-md-2 text-center">
                                                    <div className="btn-group">
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => removeQuantity(item.id)}
                                                        >
                                                            -
                                                        </button>
                                                        <input
                                                            type="text"
                                                            value={quantities[item.id]}
                                                            className="form-control form-control-sm text-center mx-1"
                                                            readOnly
                                                            style={{ width: "40px" }}
                                                        />
                                                        <button
                                                            className="btn btn-outline-secondary btn-sm"
                                                            onClick={() => addQuantity(item.id)}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-md-2 text-center fw-semibold">
                                                    <span className="d-md-none text-muted me-1">Total:</span>
                                                    ₹{(item.price * quantities[item.id]).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex justify-content-between align-items-center">
                            <Link to={`/explore`} className="btn btn-link text-primary">
                                <i className="bi bi-arrow-left"></i> Continue Shopping
                            </Link>
                            {/*<button className="btn btn-outline-secondary">*/}
                            {/*    <i className="bi bi-arrow-clockwise"></i> Update Cart*/}
                            {/*</button>*/}
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="col-lg-4">
                        <div className="bg-light rounded p-4 sticky-top">
                            <h5 className="fw-bold mb-3">Order Summary</h5>

                            <ul className="list-unstyled mb-4">
                                <li className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Shipping</span>
                                    <span>₹{shipping.toFixed(2)}</span>
                                </li>
                                <li className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Tax</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </li>
                                <li className="d-flex justify-content-between border-top pt-2 fw-bold">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </li>
                            </ul>

                            {/* PROMO CODE */}
                            {/*<div className="input-group mb-3">*/}
                            {/*    <input type="text" className="form-control" placeholder="Promo Code" />*/}
                            {/*    <button className="btn btn-primary">Apply</button>*/}
                            {/*</div>*/}

                            <button className="btn btn-primary w-100 mb-3" onClick={() => navigate('/orders')}>
                                <i className="bi bi-credit-card"></i> Proceed to Checkout
                            </button>
                            <p className="text-center text-muted small">Secure checkout powered by RazorPay</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart