
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { userService } from '../../service/userService';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        dob: '',
        gender: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { backendUrl: authBackendUrl } = useContext(AppContext);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const profileUrl = authBackendUrl.replace('/api/v1/auth', '/api/v1/users/profile');

                const response = await axios.get(profileUrl, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (response.status === 200) {
                    setUser(prev => ({
                        ...prev,
                        ...response.data
                    }));
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                if (error.response?.status === 403 || error.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate, authBackendUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('authToken');
            await userService.updateUserProfile(token, user);
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            const msg = error.response?.data?.message || "Failed to update profile.";
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container" style={{ paddingTop: '80px', paddingBottom: '20px' }}>
            <div className="row justify-content-center">
                <div className="col-xl-9 col-lg-10">
                    <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                        {/* Compact Header */}
                        <div className="card-header bg-primary text-white p-3 d-flex align-items-center">
                            <div className="bg-white rounded-circle p-1 shadow-sm me-3" style={{ width: '60px', height: '60px' }}>
                                <div className="bg-light rounded-circle w-100 h-100 d-flex align-items-center justify-content-center">
                                    <i className="bi bi-person-fill fs-2 text-secondary"></i>
                                </div>
                            </div>
                            <div>
                                <h4 className="fw-bold mb-0 text-white">{user.name || 'User Name'}</h4>
                                <small className="mb-0 opacity-75">{user.email || 'user@example.com'}</small>
                            </div>
                        </div>

                        <div className="card-body p-3 p-md-4">
                            <h6 className="fw-bold text-secondary mb-3">Account Information</h6>

                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="row g-3">
                                    <div className="col-md-6 col-lg-3">
                                        <label className="form-label text-muted small fw-bold mb-1">Full Name</label>
                                        <input type="text" className="form-control form-control-sm bg-light border-0" value={user.name} readOnly />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label className="form-label text-muted small fw-bold mb-1">Email Address</label>
                                        <input type="email" className="form-control form-control-sm bg-light border-0" value={user.email} readOnly />
                                    </div>
                                    <div className="col-md-6 col-lg-3">
                                        <label className="form-label text-muted small fw-bold mb-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control form-control-sm"
                                            placeholder="Phone"
                                            name="phone"
                                            value={user.phone || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-2">
                                        <label className="form-label text-muted small fw-bold mb-1">Gender</label>
                                        <select
                                            className="form-select form-select-sm"
                                            name="gender"
                                            value={user.gender || ''}
                                            onChange={handleChange}
                                        >
                                            <option value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 col-lg-3">
                                        <label className="form-label text-muted small fw-bold mb-1">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control form-control-sm"
                                            name="dob"
                                            value={user.dob || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-12 col-lg-9">
                                        <label className="form-label text-muted small fw-bold mb-1">Street Address</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Street address"
                                            name="address"
                                            value={user.address || ''}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-6 col-md-3">
                                        <label className="form-label text-muted small fw-bold mb-1">City</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="City"
                                            name="city"
                                            value={user.city || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label text-muted small fw-bold mb-1">State</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="State"
                                            name="state"
                                            value={user.state || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label text-muted small fw-bold mb-1">Zip Code</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Zip"
                                            name="zipCode"
                                            value={user.zipCode || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <label className="form-label text-muted small fw-bold mb-1">Country</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-sm"
                                            placeholder="Country"
                                            name="country"
                                            value={user.country || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 d-flex gap-2 justify-content-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => setShowPasswordModal(true)}
                                    >
                                        Change Password
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-primary px-4"
                                        onClick={handleSaveChanges}
                                        disabled={saving}
                                    >
                                        {saving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Recent Orders Compact */}
                        <div className="card-footer bg-light p-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-bold text-secondary m-0">Recent Orders</h6>
                                <button className="btn btn-link btn-sm text-primary text-decoration-none fw-semibold p-0" onClick={() => navigate('/orders')}>View All</button>
                            </div>
                            <div className="text-center py-3 border rounded bg-white">
                                <p className="text-muted m-0 small">No recent orders to show.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ChangePasswordModal
                show={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />
        </div>
    );
};

export default Profile;
