import React from 'react';

const RestaurantCard = ({
    name,
    image,
    rating,
    cuisine,
    deliveryFee,
    estimatedTime
}) => {
    return (
        <div className="card h-100 overflow-hidden border-0 shadow-sm" style={{ cursor: 'pointer' }}>
            <div className="position-relative">
                <img
                    src={image}
                    alt={name}
                    className="card-img-top object-fit-cover"
                    style={{ height: '220px', transition: 'transform 0.5s ease' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }}>
                    <div className="d-flex justify-content-between align-items-end px-2">
                        <span className="badge bg-white text-dark rounded-pill shadow-sm px-3 py-2 fw-bold">
                            <i className="bi bi-clock me-1 text-primary"></i>{estimatedTime}
                        </span>
                        <span className="badge bg-primary text-white rounded-pill px-2 py-1 dflex align-items-center">
                            {rating} <i className="bi bi-star-fill ms-1" style={{ fontSize: '0.7em' }}></i>
                        </span>
                    </div>
                </div>
            </div>
            <div className="card-body p-3">
                <h5 className="card-title fw-bold text-secondary mb-1">{name}</h5>
                <p className="text-muted small mb-3">{cuisine}</p>

                <div className="d-flex align-items-center text-muted small border-top pt-3">
                    <i className="bi bi-bicycle me-2 text-primary fs-5"></i>
                    <span>{deliveryFee === 'Free' ? <span className="text-success fw-bold">Free Delivery</span> : `Delivery: ${deliveryFee}`}</span>
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
