import React from 'react';

const Hero = () => {
    return (
        <div className="bg-white overflow-hidden">
            <div className="hero-pattern">
                <div className="container py-5 py-md-6">
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-5 mb-md-0">
                            <h1 className="display-4 fw-bold text-secondary">
                                <span className="d-block">Delicious Food</span>
                                <span className="d-block text-primary">Delivered Fast</span>
                            </h1>
                            <p className="lead text-muted my-4 pe-md-5">
                                Choose from hundreds of restaurants and get your favorite meals delivered to your doorstep. Quick, easy, and tasty!
                            </p>

                            <div className="d-flex mt-4 flex-column flex-sm-row gap-2">
                                <div className="flex-grow-1">
                                    <input
                                        type="text"
                                        placeholder="Enter your address"
                                        className="form-control form-control-lg"
                                    />
                                </div>
                                <button className="btn btn-primary btn-lg d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search me-2" viewBox="0 0 16 16">
                                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                                    </svg>
                                    Find Food
                                </button>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="position-relative">
                                <img
                                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                    alt="Delicious pizza"
                                    className="img-fluid rounded-4 shadow animate-float"
                                />
                                <div className="position-absolute bottom-0 start-0 translate-middle-y bg-white rounded-3 shadow p-2 animate-float"
                                     style={{ animationDelay: '0.5s', width: '7rem', height: '7rem' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                                        alt="Burger"
                                        className="w-100 h-100 rounded object-fit-cover"
                                    />
                                </div>
                                <div className="position-absolute top-0 end-0 translate-middle bg-white rounded-3 shadow p-2 animate-float"
                                     style={{ animationDelay: '1s', width: '6rem', height: '6rem' }}>
                                    <img
                                        src="https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80"
                                        alt="Sushi"
                                        className="w-100 h-100 rounded object-fit-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;