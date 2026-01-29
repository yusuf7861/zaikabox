import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { assets } from "../../assets/assets.js";

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

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);
        setError(null);
        setSubmitted(false);

        try {
            const response = await axios.post(`${assets.backendUrl}/contact-us`, formData);

            setFormData({ name: "", email: "", subject: "", message: "" });

            if (response.status === 200) {
                setLoading(false);
                setSubmitted(true);
                toast.success("Message sent successfully!");
            } else {
                toast.error("Something went wrong!");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError(err.response?.data?.message || "Failed to send message.");
            toast.error(err.response?.data?.message || "Failed to send message.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ paddingTop: '100px', minHeight: '80vh' }} className="pb-5 bg-light">
            <div className="container">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold text-primary display-6 mb-3">Get in Touch</h2>
                    <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
                        Have questions about our service or want to partner with us? We'd love to hear from you. Fill out the form below or reach out directly.
                    </p>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Contact Info Cards */}
                    <div className="col-12 col-lg-4 order-lg-2">
                        <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4">Contact Information</h5>

                                <div className="d-flex align-items-start mb-4">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                                        <i className="bi bi-geo-alt-fill fs-5"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Our Location</h6>
                                        <p className="text-muted small mb-0">123 Flavor Street, Foodie City, FC 90210, India</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start mb-4">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                                        <i className="bi bi-envelope-fill fs-5"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Email Us</h6>
                                        <p className="text-muted small mb-0">support@zaikabox.com</p>
                                        <p className="text-muted small mb-0">partners@zaikabox.com</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-start">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                                        <i className="bi bi-telephone-fill fs-5"></i>
                                    </div>
                                    <div>
                                        <h6 className="fw-bold mb-1">Call Us</h6>
                                        <p className="text-muted small mb-0">+91 123 456 7890</p>
                                        <p className="text-muted small mb-0">Mon - Fri, 9am - 6pm</p>
                                    </div>
                                </div>

                                <hr className="my-4 text-muted bg-secondary" />

                                <div className="d-flex justify-content-center gap-3">
                                    {['facebook', 'twitter', 'instagram', 'linkedin'].map(social => (
                                        <a key={social} href="#" className="btn btn-outline-secondary rounded-circle btn-sm" style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <i className={`bi bi-${social}`}></i>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="col-12 col-lg-8 order-lg-1">
                        <div className="card border-0 shadow-sm rounded-4 h-100">
                            <div className="card-body p-4 p-md-5">
                                <h5 className="fw-bold mb-4">Send us a Message</h5>
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted">YOUR NAME</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control bg-light border-0 py-2"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Doe"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted">EMAIL ADDRESS</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control bg-light border-0 py-2"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="mb-3">
                                                <label className="form-label small fw-bold text-muted">SUBJECT</label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    className="form-control bg-light border-0 py-2"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="How can we help?"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-muted">MESSAGE</label>
                                                <textarea
                                                    name="message"
                                                    className="form-control bg-light border-0 py-2"
                                                    rows="5"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Write your message here..."
                                                    required
                                                    style={{ resize: 'none' }}
                                                ></textarea>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary px-5 py-2 rounded-pill fw-semibold" disabled={loading}>
                                                {loading ? (
                                                    <span><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...</span>
                                                ) : "Send Message"}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;