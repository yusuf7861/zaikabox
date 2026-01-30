
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
        <section className="bg-light d-flex align-items-center" style={{ paddingTop: '100px', paddingBottom: '40px', minHeight: '80vh' }}>
            <div className="container">
                <button onClick={() => window.history.back()} className="btn btn-sm btn-link text-decoration-none text-secondary mb-3 ps-0">
                    <i className="bi bi-arrow-left me-1"></i>Back to Menu
                </button>

                <div className="card shadow border-0 overflow-hidden rounded-3">
                    <div className="row g-0">
                        {/* Image Section */}
                        <div className="col-md-5 position-relative">
                            <img
                                className="img-fluid w-100 h-100 object-fit-cover"
                                style={{ minHeight: "300px", maxHeight: "450px" }}
                                src={data.imageUrl}
                                alt={data.name}
                            />
                            <div className="position-absolute top-0 start-0 m-3">
                                <span className="badge bg-warning text-dark small px-2 py-1 rounded-pill shadow-sm">
                                    {data.category}
                                </span>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="col-md-7 bg-white p-3 p-md-4 d-flex flex-column justify-content-center">
                            <h2 className="fw-bold text-secondary mb-2">{data.name}</h2>

                            <div className="d-flex align-items-center mb-3">
                                <div className="text-primary fs-3 fw-bold me-2">₹{data.price}</div>
                                <div className="text-muted text-decoration-line-through small">₹{Math.floor(data.price * 1.2)}</div>
                                <span className="ms-2 badge bg-success-subtle text-success rounded-pill" style={{ fontSize: '0.7rem' }}>20% OFF</span>
                            </div>

                            <p className="text-muted mb-4 small" style={{ lineHeight: '1.6' }}>
                                {data.description}
                            </p>

                            <div className="d-flex gap-2 mt-auto">
                                {quantities[id] > 0 ? (
                                    <div className="d-flex gap-2 w-100">
                                        <button className="btn btn-success flex-grow-1 rounded-pill shadow-sm btn-sm" style={{ background: 'linear-gradient(45deg, #198754, #20c997)', border: 'none' }}>
                                            <i className="bi bi-check-circle-fill me-1"></i>Added
                                        </button>
                                        <button onClick={() => addQuantity(id)} className="btn btn-outline-success rounded-circle btn-sm d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px', padding: 0 }}>
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-primary w-100 rounded-pill shadow transition-all hover-scale btn-sm"
                                        onClick={() => addQuantity(id)}
                                    >
                                        <i className="bi bi-cart-plus me-1"></i>Add to Cart
                                    </button>
                                )}
                            </div>

                            {/* Additional Info / Trust Badges */}
                            <div className="row mt-3 pt-3 border-top g-0 text-center">
                                <div className="col-4 border-end">
                                    <i className="bi bi-clock fs-5 text-primary mb-1 d-block"></i>
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>30 min</small>
                                </div>
                                <div className="col-4 border-end">
                                    <i className="bi bi-star-fill fs-5 text-warning mb-1 d-block"></i>
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>4.8 Rating</small>
                                </div>
                                <div className="col-4">
                                    <i className="bi bi-shield-check fs-5 text-success mb-1 d-block"></i>
                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>Hygienic</small>
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