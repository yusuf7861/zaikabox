import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {StoreContext} from "../../context/StoreContext.jsx";

const CategoryCard = ({ id, name, image, price, category, description, rating = 4.5 }) => {
    const {addQuantity, removeQuantity, quantities} = useContext(StoreContext);
    return (
        <div className="card h-100 border-0 overflow-hidden" style={{textDecoration: 'none'}}>
                {/* Image with name overlay */}
                <div className="position-relative" style={{ height: '9rem' }}>
                    <Link to={`/food/${id}`}>
                        <img
                            src={image}
                            alt={name}
                            className="card-img-top h-100 w-100 object-fit-cover"
                            style={{ transition: 'transform 0.3s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)' }
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)' }
                        />
                    </Link>
                    {/* Overlay for name */}
                    <div
                        className="position-absolute bottom-0 start-0 end-0 d-flex align-items-end"
                        style={{
                            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                            top: 0,
                            pointerEvents: 'none',
                        }}
                    >
                        <div className="p-2 text-white">
                            <h6 className="fw-semibold m-0">{name}</h6>
                        </div>
                    </div>
                </div>

            {/* Details below image */}
            <div className="p-2">
                <p className="text-bold small mb-1">{category}</p>
                <p className="text-muted text-truncate small mb-1">{description}</p>

                {/* Price + Rating side-by-side */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="fw-bold text-black m-0">₹{price}</p>
                    <button className="btn btn-sm btn-outline-warning d-flex align-items-center px-2 py-1">
                        <i className="bi bi-star-fill me-1"></i> {rating}
                    </button>
                </div>

                {/* Add to Cart */}
                <div className={"d-flex justify-content-between"}>
                    <Link to={`/food/${id}`} className="btn btn-primary btn-sm">View Food</Link>
                        {quantities[id] > 0 ? (
                            <div className={"d-flex align-items-center gap-1"}>
                                <button className={"btn btn-danger btn-sm"} onClick={() => removeQuantity(id)}><i className={"bi bi-dash-circle"}></i></button>
                                <span className={"fw-bold"}>{quantities[id]}</span>
                                <button className={"btn btn-success btn-sm"} onClick={() => addQuantity(id)}><i className={"bi bi-plus-circle"}></i></button>
                            </div>
                        ) : (
                            <button className={"btn btn-primary btn-sm"} onClick={() => addQuantity(id)}>
                                <i className="bi bi-plus-circle"></i>
                            </button>
                        )}
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
