import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const formData = { name, email, password };
      const response = await axios.post("https://zaikabox-app-latest.onrender.com/api/v1/users/register", formData);
      if (response.status === 201) {
        setLoading(false);
        toast.success("Account created successfully");
        navigate("/login");
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        // Set the error message to state to display on page
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center bg-light"
      style={{ paddingTop: '80px' }}
    >
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="card-header bg-primary text-white p-4 text-center border-0">
          <h3 className="mb-0 fw-bold">Create Account</h3>
          <p className="mb-0 opacity-75 small">Join Zaikabox for delicious food</p>
        </div>

        <div className="card-body p-4 p-md-5">
          {error && (
            <div className="alert alert-danger shadow-sm rounded-3 d-flex align-items-center mb-4 fade-in" role="alert">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={onSubmitHandler}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-muted small fw-bold">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  id="name"
                  className="form-control form-control-lg bg-light border-start-0 ps-0"
                  placeholder="Enter your name"
                  required
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-muted small fw-bold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  id="email"
                  className="form-control form-control-lg bg-light border-start-0 ps-0"
                  placeholder="name@example.com"
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label text-muted small fw-bold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg bg-light border-start-0 ps-0"
                  placeholder="Min 8 characters"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill shadow-sm" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : "Register"}
            </button>

            <div className="mt-4 text-center">
              <p className="text-muted mb-0">
                Already have an account?{" "}
                <Link to="/login" className="text-primary fw-semibold text-decoration-none hover-shadow-sm">
                  Login here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;