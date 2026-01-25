import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";

const CategoryCard = ({ id, name, image, price, category, description, rating = 4.5 }) => {
    const { addQuantity, removeQuantity, quantities } = useContext(StoreContext);

    return (
        <div className="card h-100 border-0 shadow-sm overflow-hidden group hover-lift">
            <div className="position-relative overflow-hidden">
                <Link to={`/food/${id}`}>
                    <img
                        src={image}
                        alt={name}
                        className="card-img-top w-100 object-fit-cover"
                        style={{ height: '200px', transition: 'transform 0.5s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </Link>
                <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-white text-warning shadow-sm d-flex align-items-center px-2 py-1 rounded-pill">
                        <i className="bi bi-star-fill me-1 small"></i> {rating}
                    </span>
                </div>
            </div>

            <div className="card-body p-3 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 className="card-title fw-bold text-secondary mb-1 text-truncate" style={{ maxWidth: '150px' }} title={name}>{name}</h6>
                        <span className="badge bg-light text-muted fw-normal rounded-pill px-2 py-1 small">{category}</span>
                    </div>
                    <span className="fw-bold text-primary fs-5">₹{price}</span>
                </div>

                <p className="card-text text-muted small flex-grow-1 text-truncate-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {description}
                </p>

                <div className="mt-3 d-flex align-items-center justify-content-between">
                    <Link to={`/food/${id}`} className="text-decoration-none small text-primary fw-semibold">
                        View Details <i className="bi bi-arrow-right ms-1"></i>
                    </Link>

                    {quantities[id] > 0 ? (
                        <div className="d-flex align-items-center bg-light rounded-pill p-1 shadow-sm">
                            <button className="btn btn-sm btn-white text-danger rounded-circle shadow-none p-1" onClick={() => removeQuantity(id)} style={{ width: '28px', height: '28px' }}>
                                <i className="bi bi-dash"></i>
                            </button>
                            <span className="mx-2 fw-bold text-secondary small">{quantities[id]}</span>
                            <button className="btn btn-sm btn-white text-success rounded-circle shadow-none p-1" onClick={() => addQuantity(id)} style={{ width: '28px', height: '28px' }}>
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm" onClick={() => addQuantity(id)}>
                            Add <i className="bi bi-plus ms-1"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
