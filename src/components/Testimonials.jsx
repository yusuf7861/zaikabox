
import React from 'react';

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Food Enthusiast",
        comment: "The delivery was incredibly fast and the food was still hot when it arrived. Will definitely order again!",
        avatar: "SJ"
    },
    {
        name: "Michael Chen",
        role: "Busy Professional",
        comment: "This app has saved me so much time. The variety of restaurants available is amazing and the service is top-notch.",
        avatar: "MC"
    },
    {
        name: "Emily Rodriguez",
        role: "Student",
        comment: "Super affordable and convenient for late-night studying. The special offers for students are a great touch!",
        avatar: "ER"
    }
];

const Testimonials = () => {
    return (
        <section className="section-padding bg-light-gray">
            <div className="container">
                <div className="text-center mb-5">
                    <h2 className="display-6 fw-bold text-secondary">What Our Customers Say</h2>
                    <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Join thousands of satisfied customers who love our service
                    </p>
                </div>

                <div className="row g-4">
                    {testimonials.map((item, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card border-0 shadow-sm h-100 p-4">
                                <div className="d-flex mb-4">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="bg-primary-light text-primary rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                                             style={{ width: '3rem', height: '3rem' }}>
                                            {item.avatar}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="fw-semibold mb-0 text-secondary">{item.name}</h5>
                                        <p className="text-muted small mb-0">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-muted fst-italic mb-4">&ldquo;{item.comment}&rdquo;</p>
                                <div className="d-flex mt-auto">
                                    {[...Array(5)].map((_, i) => (
                                        <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;