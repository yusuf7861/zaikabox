import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Hero = () => {
    return (
        <div style={{
            position: 'relative',
            height: '85vh',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            background: 'linear-gradient(to right, #fff 0%, #fff 30%, transparent 100%), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop") center/cover no-repeat'
        }}>
            <div className="container" style={{ position: 'relative', zIndex: 2 }}>
                <div className="row align-items-center">
                    <div className="col-lg-7 animate-slideUp">
                        <span style={{
                            color: 'var(--primary)',
                            fontWeight: '600',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            marginBottom: '1rem',
                            display: 'block'
                        }}>
                            <i className="bi bi-star-fill me-2"></i>Premium Food Delivery
                        </span>
                        <h1 className="display-4 display-md-3 display-lg-1 fw-bold mb-4 text-secondary">
                            Savor the <span className="text-primary">Extraordinary</span>
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'var(--text-muted)',
                            marginBottom: '2.5rem',
                            maxWidth: '550px'
                        }}>
                            Experience culinary excellence delivered to your doorstep. From local gems to gourmet masterpieces, we bring the city's finest flavors to you.
                        </p>
                        <div className="d-flex gap-3">
                            <Link to="/explore" className="btn-primary text-decoration-none">
                                Order Now <i className="bi bi-arrow-right ms-2"></i>
                            </Link>
                            <Link to="/contact" className="btn-secondary text-decoration-none">
                                View Menu
                            </Link>
                        </div>

                        <div className="mt-5 d-flex gap-5">
                            <div>
                                <h3 className="mb-0" style={{ color: 'var(--primary)', fontSize: '2rem' }}>30+</h3>
                                <p className="text-muted mb-0">Min Delivery</p>
                            </div>
                            <div>
                                <h3 className="mb-0" style={{ color: 'var(--primary)', fontSize: '2rem' }}>500+</h3>
                                <p className="text-muted mb-0">Restaurants</p>
                            </div>
                            <div>
                                <h3 className="mb-0" style={{ color: 'var(--primary)', fontSize: '2rem' }}>4.9</h3>
                                <p className="text-muted mb-0">Rating</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Blur Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '60%',
                height: '100%',
                background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
                transform: 'scaleX(-1)',
                pointerEvents: 'none'
            }}></div>
        </div>
    );
};

export default Hero;