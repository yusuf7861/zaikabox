
import React from 'react';

const steps = [
    {
        icon: "bi-geo-alt",
        title: "Set Your Location",
        description: "Enter your address to find nearby restaurants"
    },
    {
        icon: "bi-search",
        title: "Choose a Restaurant",
        description: "Browse menus and reviews to find what you crave"
    },
    {
        icon: "bi-cart",
        title: "Place Your Order",
        description: "Select your items and checkout securely"
    },
    {
        icon: "bi-truck",
        title: "Enjoy Your Delivery",
        description: "Track your order until it arrives at your door"
    }
];

const HowItWorks = () => {
    return (
        <section className="pt-4 section-padding bg-light-gray">
            <div className="container">
                <div className="text-center mb-2">
                    <h2 className="display-6 fw-bold text-secondary mb-3">How It Works</h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Getting your favorite food delivered is easier than ever
                    </p>
                </div>

                <div className="row g-2">
                    {steps.map((step, index) => (
                        <div key={index} className="col-md-6 col-lg-3">
                            <div className="d-flex flex-column align-items-center text-center">
                                <div className="position-relative mb-4">
                                    <div className="d-flex align-items-center justify-content-center bg-primary-light rounded-circle mb-3"
                                         style={{ width: '4rem', height: '4rem' }}>
                                        <i className={`bi ${step.icon} fs-4 text-primary`}></i>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="d-none d-lg-block position-absolute top-50 start-100 translate-middle"
                                             style={{ width: 'calc(100% - 2rem)', height: '2px', background: '#e9ecef', marginLeft: '1rem' }}></div>
                                    )}
                                </div>
                                <h3 className="h5 fw-semibold text-secondary mb-2">{step.title}</h3>
                                <p className="text-muted">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;