import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { fetchFoodDetails } from "../../service/foodService.js";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext.jsx";

const FoodDetail = () => {

    const { addQuantity, quantities } = useContext(StoreContext);

    const { id } = useParams();

    const [data, setData] = useState({});

    useEffect(() => {
        const loadFoodDetails = async () => {
            try {
                const foodData = await fetchFoodDetails(id);
                setData(foodData);
            } catch (e) {
                toast.error("Failed to fetch food details", e);
            }
        }
        loadFoodDetails();
    }, [id]);


    return (
        <section className="py-5 bg-light min-vh-100 d-flex align-items-center" style={{ paddingTop: '100px' }}>
            <div className="container px-4 px-lg-5">
                <button onClick={() => window.history.back()} className="btn btn-link text-decoration-none text-secondary mb-4 ps-0">
                    <i className="bi bi-arrow-left me-2"></i>Back to Menu
                </button>

                <div className="card shadow-lg border-0 overflow-hidden rounded-4">
                    <div className="row g-0">
                        {/* Image Section */}
                        <div className="col-md-6 position-relative">
                            <img
                                className="img-fluid w-100 h-100 object-fit-cover"
                                style={{ minHeight: "400px" }}
                                src={data.imageUrl}
                                alt={data.name}
                            />
                            <div className="position-absolute top-0 start-0 m-4">
                                <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill shadow-sm">
                                    {data.category}
                                </span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="col-md-6 bg-white p-5 d-flex flex-column justify-content-center">
                            <h1 className="display-4 fw-bold text-secondary mb-2">{data.name}</h1>

                            <div className="d-flex align-items-center mb-4">
                                <div className="text-primary fs-2 fw-bold me-3">₹{data.price}</div>
                                <div className="text-muted text-decoration-line-through fs-5">₹{Math.floor(data.price * 1.2)}</div>
                                <span className="ms-3 badge bg-success-subtle text-success rounded-pill">20% OFF</span>
                            </div>

                            <p className="lead text-muted mb-5" style={{ lineHeight: '1.8' }}>
                                {data.description}
                            </p>

                            <div className="d-flex gap-3 mt-auto">
                                {quantities[id] > 0 ? (
                                    <div className="d-flex gap-3 w-100">
                                        <button className="btn btn-success btn-lg flex-grow-1 rounded-pill shadow-sm" style={{ background: 'linear-gradient(45deg, #198754, #20c997)', border: 'none' }}>
                                            <i className="bi bi-check-circle-fill me-2"></i>Added to Cart
                                        </button>
                                        <button onClick={() => addQuantity(id)} className="btn btn-outline-success btn-lg rounded-circle" style={{ width: '50px', height: '50px', padding: 0 }}>
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary btn-lg w-100 rounded-pill shadow transition-all hover-scale"
                                        onClick={() => addQuantity(id)}
                                    >
                                        <i className="bi bi-cart-plus me-2"></i>Add to Cart
                                    </button>
                                )}
                            </div>

                            {/* Additional Info / Trust Badges */}
                            <div className="row mt-5 pt-4 border-top g-3">
                                <div className="col-4 text-center border-end">
                                    <i className="bi bi-clock fs-4 text-primary mb-2 d-block"></i>
                                    <small className="text-muted">30 min Delivery</small>
                                </div>
                                <div className="col-4 text-center border-end">
                                    <i className="bi bi-star-fill fs-4 text-warning mb-2 d-block"></i>
                                    <small className="text-muted">4.8 Rating</small>
                                </div>
                                <div className="col-4 text-center">
                                    <i className="bi bi-shield-check fs-4 text-success mb-2 d-block"></i>
                                    <small className="text-muted">Hygienic</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FoodDetail;