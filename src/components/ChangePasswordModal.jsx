import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { userService } from '../service/userService';

const ChangePasswordModal = ({ show, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }

        if (formData.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken'); // Assuming token is stored here
            await userService.changeUserPassword(token, {
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword
            });
            toast.success("Password changed successfully!");
            onClose();
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to change password.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header border-0 pb-0">
                        <h5 className="modal-title fw-bold">Change Password</h5>
                        <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
                    </div>
                    <div className="modal-body p-4">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">Current Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-muted">New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="form-label small fw-bold text-muted">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary px-4" disabled={loading}>
                                    {loading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
