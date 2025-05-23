import React, {useState} from 'react';
// import './contact.css'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Simple validation
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            alert("Please fill in all fields.");
            return;
        }

        console.log("Form submitted:", formData);
        setSubmitted(true);

        // Optionally send formData to backend API here

        // Clear form
        setFormData({
            name: "",
            email: "",
            subject: "",
            message: ""
        });
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Contact Us</h2>
            {submitted && (
                <div className="alert alert-success" role="alert">
                    Thank you! Your message has been sent.
                </div>
            )}

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
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">
                    Send Message
                </button>
            </form>
        </div>
    );
};

export default Contact;