import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: 'User Name',
        email: 'user@example.com',
        phone: '',
        address: ''
    });

    useEffect(() => {
        // Simulating fetching user data or getting from local storage
        const email = localStorage.getItem('userEmail');
        if (email) {
            setUser(prev => ({ ...prev, email: email, name: email.split('@')[0] }));
        } else {
            // If not logged in, redirect
            const token = localStorage.getItem('authToken');
            if (!token) navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="container py-5" style={{ paddingTop: '100px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-primary text-white p-4 text-center position-relative">
                            <div className="d-inline-block p-1 bg-white rounded-circle shadow mb-3">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '100px', height: '100px' }}>
                                    <i className="bi bi-person-fill display-4 text-secondary"></i>
                                </div>
                            </div>
                            <h3 className="fw-bold mb-0 text-white">{user.name}</h3>
                            <p className="mb-0 opacity-75">{user.email}</p>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            <h5 className="fw-bold text-secondary mb-4">Account Information</h5>

                            <form>
                                <div className="row g-4">
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold">Full Name</label>
                                        <input type="text" className="form-control form-control-lg bg-light border-0" value={user.name} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold">Email Address</label>
                                        <input type="email" className="form-control form-control-lg bg-light border-0" value={user.email} readOnly />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold">Phone Number</label>
                                        <input type="tel" className="form-control form-control-lg" placeholder="Add phone number" />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label text-muted small fw-bold">Delivery Address</label>
                                        <input type="text" className="form-control form-control-lg" placeholder="Add address" />
                                    </div>
                                </div>

                                <div className="mt-5 d-flex gap-3">
                                    <button type="button" className="btn btn-primary px-4">Save Changes</button>
                                    <button type="button" className="btn btn-outline-secondary px-4">Change Password</button>
                                </div>
                            </form>

                            <hr className="my-5" />

                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="fw-bold text-secondary m-0">Recent Orders</h5>
                                <button className="btn btn-link text-primary text-decoration-none fw-semibold" onClick={() => navigate('/orders')}>View All</button>
                            </div>

                            <div className="text-center py-4 bg-light rounded-3">
                                <i className="bi bi-box-seam fs-1 text-muted opacity-50 mb-2"></i>
                                <p className="text-muted m-0">No recent orders to show.</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
