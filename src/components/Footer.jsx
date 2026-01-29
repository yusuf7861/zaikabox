
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-light pt-4 border-top">
            <div className="container py-4">
                <div className="row gy-4">
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            {/* Assuming there's a logo or just text */}
                            <h5 className="fw-bold text-primary mb-0" style={{ letterSpacing: '-0.5px' }}>ZaikaBox</h5>
                        </div>
                        <p className="text-secondary small mb-4" style={{ maxWidth: '300px', lineHeight: '1.6' }}>
                            Indulge in flavors that bring valid happiness. From local favorites to gourmet delights, we deliver joy to your doorstep.
                        </p>
                        <div className="d-flex gap-2">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="btn btn-sm btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center p-0"
                                    style={{ width: '32px', height: '32px', transition: 'all 0.2s' }}
                                >
                                    <i className={`bi bi-${social} small`}></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-3 col-6">
                        <h6 className="fw-bold text-dark mb-3 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Company</h6>
                        <ul className="list-unstyled">
                            {['About Us', 'Careers', 'Team', 'Blog', 'Privacy Policy'].map((link) => (
                                <li key={link} className="mb-2">
                                    <a href="#" className="text-secondary text-decoration-none small hover-link" style={{ fontSize: '0.85rem' }}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-2 col-md-3 col-6">
                        <h6 className="fw-bold text-dark mb-3 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Quick Links</h6>
                        <ul className="list-unstyled">
                            {['Help Center', 'Partner with us', 'Ride with us', 'Terms & Conditions', 'Cookie Policy'].map((link) => (
                                <li key={link} className="mb-2">
                                    <a href="#" className="text-secondary text-decoration-none small hover-link" style={{ fontSize: '0.85rem' }}>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-4 col-md-12">
                        <h6 className="fw-bold text-dark mb-3 small text-uppercase" style={{ letterSpacing: '0.5px' }}>Stay Connected</h6>
                        <p className="text-secondary small mb-3">Join our newsletter for exclusive offers and latest food trends.</p>
                        <form className="d-flex gap-2 mb-3">
                            <input
                                type="email"
                                className="form-control form-control-sm border-secondary-subtle"
                                placeholder="Email address"
                                style={{ fontSize: '0.85rem' }}
                            />
                            <button className="btn btn-primary btn-sm px-3" type="button">Subscribe</button>
                        </form>
                        <div className="d-flex align-items-center gap-2 text-secondary small">
                            <i className="bi bi-geo-alt-fill text-primary"></i>
                            <span>123 Flavor Street, Foodie City, FC 90210</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white border-top py-3">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
                            <p className="text-muted small mb-0" style={{ fontSize: '0.8rem' }}>
                                © 2026 ZaikaBox. All rights reserved.
                            </p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <div className="d-inline-flex gap-3">
                                <a href="#" className="text-secondary text-decoration-none small" style={{ fontSize: '0.8rem' }}>Privacy</a>
                                <a href="#" className="text-secondary text-decoration-none small" style={{ fontSize: '0.8rem' }}>Security</a>
                                <a href="#" className="text-secondary text-decoration-none small" style={{ fontSize: '0.8rem' }}>Terms</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;