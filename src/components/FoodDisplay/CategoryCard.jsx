
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
                        style={{ height: '160px', transition: 'transform 0.5s ease' }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                </Link>
                <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge bg-white text-warning shadow-sm d-flex align-items-center px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
                        <i className="bi bi-star-fill me-1 small"></i> {rating}
                    </span>
                </div>
            </div>

            <div className="card-body p-2 d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <div>
                        <h6 className="card-title fw-bold text-secondary mb-0 text-truncate small" style={{ maxWidth: '140px' }} title={name}>{name}</h6>
                        <span className="badge bg-light text-muted fw-normal rounded-pill px-2 py-0" style={{ fontSize: '0.65rem' }}>{category}</span>
                    </div>
                    <span className="fw-bold text-primary small">₹{price}</span>
                </div>

                <p className="card-text text-muted small flex-grow-1 text-truncate-2 mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.8rem' }}>
                    {description}
                </p>

                <div className="mt-auto d-flex align-items-center justify-content-between">
                    <Link to={`/food/${id}`} className="text-decoration-none small text-primary fw-semibold" style={{ fontSize: '0.8rem' }}>
                        Details <i className="bi bi-arrow-right ms-1"></i>
                    </Link>

                    {quantities[id] > 0 ? (
                        <div className="d-flex align-items-center bg-light rounded-pill p-1 shadow-sm">
                            <button className="btn btn-sm btn-white text-danger rounded-circle shadow-none p-0 d-flex align-items-center justify-content-center" onClick={() => removeQuantity(id)} style={{ width: '24px', height: '24px' }}>
                                <i className="bi bi-dash"></i>
                            </button>
                            <span className="mx-2 fw-bold text-secondary" style={{ fontSize: '0.8rem' }}>{quantities[id]}</span>
                            <button className="btn btn-sm btn-white text-success rounded-circle shadow-none p-0 d-flex align-items-center justify-content-center" onClick={() => addQuantity(id)} style={{ width: '24px', height: '24px' }}>
                                <i className="bi bi-plus"></i>
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-sm btn-primary rounded-pill px-3 py-1 shadow-sm" style={{ fontSize: '0.8rem' }} onClick={() => addQuantity(id)}>
                            Add <i className="bi bi-plus ms-1"></i>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
