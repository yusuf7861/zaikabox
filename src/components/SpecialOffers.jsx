
import React from 'react';

const offers = [
    {
        title: "50% OFF First Order",
        description: "Use code: WELCOME50",
        image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bgClass: "bg-amber-50",
        textClass: "text-amber-800"
    },
    {
        title: "Free Delivery",
        description: "On orders over $20",
        image: "https://images.unsplash.com/photo-1513639304702-7b279de54524?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        bgClass: "bg-blue-50",
        textClass: "text-blue-800"
    }
];

const SpecialOffers = () => {
    return (
        <section className="section-padding">
            <div className="container">
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-5">
                    <div>
                        <h2 className="display-6 fw-bold text-secondary mb-2">Special Offers</h2>
                        <p className="lead text-muted">
                            Exclusive deals to save on your favorite meals
                        </p>
                    </div>
                    <button className="btn btn-outline-primary mt-3 mt-md-0">
                        View All Offers
                    </button>
                </div>

                <div className="row g-4">
                    {offers.map((offer, index) => (
                        <div key={index} className="col-md-6">
                            <div className={`card border-0 h-100 ${offer.bgClass}`}>
                                <div className="row g-0 h-100">
                                    <div className="col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
                                        <h3 className={`h4 fw-bold mb-3 ${offer.textClass}`}>
                                            {offer.title}
                                        </h3>
                                        <p className="text-muted mb-4">{offer.description}</p>
                                        <button className="btn btn-primary w-auto align-self-start">
                                            Order Now
                                        </button>
                                    </div>
                                    <div className="col-md-6">
                                        <img
                                            src={offer.image}
                                            alt={offer.title}
                                            className="img-fluid h-100 w-100 object-fit-cover"
                                            style={{ minHeight: '200px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SpecialOffers;