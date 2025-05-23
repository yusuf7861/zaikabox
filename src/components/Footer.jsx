
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white pt-5">
            <div className="container py-5">
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold text-secondary mb-4">ZaikaBox</h5>
                        <p className="text-muted mb-4">
                            Bringing delicious food from the best restaurants straight to your doorstep.
                        </p>
                        <div className="d-flex gap-3">
                            {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="text-muted"
                                >
                                    <div className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                                         style={{ width: '36px', height: '36px', transition: 'all 0.3s' }}
                                         onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(249, 115, 22, 0.1)'}
                                         onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}>
                                        <i className={`bi bi-${social} text-secondary`}></i>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold text-secondary mb-4">Useful Links</h5>
                        <ul className="list-unstyled">
                            {['About Us', 'Blog', 'Careers', 'Contact Us', 'Privacy Policy'].map((link) => (
                                <li key={link} className="mb-2">
                                    <a href="#" className="text-muted text-decoration-none hover-text-primary">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold text-secondary mb-4">For Businesses</h5>
                        <ul className="list-unstyled">
                            {['Add a Restaurant', 'Business App', 'Restaurant Dashboard', 'Advertise', 'Partnership'].map((link) => (
                                <li key={link} className="mb-2">
                                    <a href="#" className="text-muted text-decoration-none hover-text-primary">
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-lg-3 col-md-6">
                        <h5 className="fw-bold text-secondary mb-4">Contact Us</h5>
                        <ul className="list-unstyled text-muted">
                            <li className="mb-2">Email: support@foodexpress.com</li>
                            <li className="mb-2">Phone: (123) 456-7890</li>
                            <li>Address: 123 Main St, Cityville, State 12345</li>
                        </ul>
                    </div>
                </div>
            </div>

            <hr className="my-0" />

            <div className="container py-4">
                <div className="row align-items-center">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <p className="text-muted small mb-0">
                            © 2025 FoodExpress. All rights reserved.
                        </p>
                    </div>
                    <div className="col-md-6">
                        <ul className="list-inline text-center text-md-end mb-0">
                            <li className="list-inline-item">
                                <a href="#" className="text-muted small">
                                    Terms of Service
                                </a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="#" className="text-muted small">
                                    Privacy Policy
                                </a>
                            </li>
                            <li className="list-inline-item ms-3">
                                <a href="#" className="text-muted small">
                                    Cookies
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;