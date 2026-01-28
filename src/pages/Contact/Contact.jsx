import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from "../../assets/assets.js";
// import './contact.css'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError(null);
        setSubmitted(false);

        try {
            const response = await axios.post(`${assets.backendUrl}/contact-us`, formData);

            // Clear form
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });

            if (response.status === 200) {
                setLoading(false);
                setSubmitted(true);
                toast.success("Request sent successfully");
            } else {
                toast.error("Something went wrong!");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError(err.response?.data?.message || "Failed to send message. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '100px' }}>
            <div className="container py-2">
                {submitted && (
                    <div className="alert alert-success" role="alert">
                        Thank you! Your message has been sent.
                    </div>
                )}

                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                <div className="row align-items-center g-2">
                    {/* Left Side: SVG or Illustration */}
                    <div className="col-12 col-md-6 text-center">
                        <img
                            src={assets.contact}
                            alt="Contact Illustration"
                            className="img-fluid"
                            style={{ maxHeight: '400px' }}
                        />
                    </div>

                    {/* Right Side: Form */}
                    <div className="col-12 col-md-6">
                        <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow-sm">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    className="form-control"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="Subject"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Message</label>
                                <textarea
                                    name="message"
                                    className="form-control"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary w-100" disabled={loading}> {loading ? 'Sending...' : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;