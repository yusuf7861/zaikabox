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
        <div className="card border-0 h-100">
            <a href="#" className="text-decoration-none text-dark">
                <div className="position-relative">
                    <img
                        src={image}
                        alt={name}
                        className="card-img-top object-fit-cover"
                        style={{ height: '200px' }}
                    />
                    <span className="position-absolute top-0 end-0 mt-3 me-3 badge bg-white text-primary fw-normal py-2 px-3">
            {estimatedTime}
          </span>
                </div>
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title fw-semibold mb-1">{name}</h5>
                        <div className="d-flex align-items-center bg-success-subtle px-2 py-1 rounded">
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="me-1"
                            >
                                <path
                                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                    fill="#FFC107"
                                    stroke="#FFC107"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span className="small fw-medium">{rating}</span>
                        </div>
                    </div>
                    <p className="card-text small text-muted mt-1">{cuisine}</p>
                    <p className="card-text small text-muted mt-2 mb-0">Delivery: {deliveryFee}</p>
                </div>
            </a>
        </div>
    );
};

export default RestaurantCard;
