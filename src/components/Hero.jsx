

import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Hero = () => {
    return (
        <div style={{
            position: 'relative',
            height: '80vh',
            minHeight: '500px',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(to right, #fff 0%, #fff 45%, transparent 100%), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row align-items-center">
                    <div className="col-lg-6 animate-slideUp mt-5 pt-4">
                        <span style={{
                            color: 'var(--primary)',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            fontSize: '0.9rem',
                            marginBottom: '0.5rem',
                            display: 'block'
                        }}>
                            <i className="bi bi-star-fill me-2"></i>Premium Food Delivery
                        </span>
                        <h1 className="fw-bold mb-3 text-secondary" style={{ fontSize: '3rem', lineHeight: '1.2' }}>
                            Savor the <span className="text-primary">Extraordinary</span>
                        </h1>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'var(--text-muted)',
                            marginBottom: '2rem',
                            maxWidth: '480px'
                        }}>
                            Experience culinary excellence delivered to your doorstep. From local gems to gourmet masterpieces.
                        </p>
                        <div className="d-flex gap-3">
                            <Link to="/explore" className="btn btn-primary px-4 py-2 rounded-pill shadow-sm text-decoration-none">
                                Order Now <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                            <Link to="/contact" className="btn btn-outline-secondary px-4 py-2 rounded-pill text-decoration-none">
                                View Menu
                            </Link>
                        </div>

                        <div className="mt-4 d-flex gap-4">
                            <div>
                                <h4 className="mb-0 fw-bold text-primary">30+</h4>
                                <small className="text-muted">Min Delivery</small>
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bold text-primary">500+</h4>
                                <small className="text-muted">Restaurants</small>
                            </div>
                            <div>
                                <h4 className="mb-0 fw-bold text-primary">4.9</h4>
                                <small className="text-muted">Rating</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Blur Overlay to fix right edge issue */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                transform: 'scaleX(-1)',
                pointerEvents: 'none',
                zIndex: 1
            }}></div>
        </div>
    );
};

export default Hero;