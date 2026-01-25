import axios from "axios";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext.jsx";
import { useState } from "react";

const Login = () => {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Password reset states
  const [showReset, setShowReset] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [resetEmail, setResetEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    setApiError("");

    try {
      const loginData = {
        email: email,
        password: password
      };

      const response = await axios.post(
        `${backendUrl}/login`,
        loginData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        // Handle the swapped token and email in the response
        const { token, email } = response.data;

        // Store the actual token (which is in the email field) in localStorage
        localStorage.setItem('authToken', email); // The JWT token is in the email field
        localStorage.setItem('userEmail', token); // The email is in the token field

        // Dispatch a custom event to notify other components about the login
        window.dispatchEvent(new Event('login'));

        setLoading(false);
        toast.success("Login successful");

        // Navigate to home page or dashboard after successful login
        navigate('/');
      } else if (response.status === 403) {
        setApiError(response.statusText);
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        setApiError(err.response.data.message ?? "Login failed");
      } else {
        setApiError("Something went wrong");
      }
    }
  };

  // Password reset handlers
  const handleResetEmailSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    try {
      const res = await axios.post(
        `${backendUrl}/send-reset-otp`,
        { email: resetEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data && res.data.token) {
        setResetToken(res.data.token);
        setResetStep(2);
        toast.success("OTP sent to your email");
      } else {
        setResetError("Failed to send OTP");
      }
    } catch (err) {
      setResetError(
        err.response?.data?.message || "Failed to send OTP"
      );
    }
    setResetLoading(false);
  };

  const handleResetOtpSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    try {
      const res = await axios.post(
        `${backendUrl}/verify-otp`,
        { otp: resetOtp, token: resetToken },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data && res.data.message?.toLowerCase().includes("success")) {
        setResetStep(3);
        toast.success("OTP verified. Set new password.");
      } else {
        setResetError("OTP verification failed");
      }
    } catch (err) {
      setResetError(
        err.response?.data?.message || "OTP verification failed"
      );
    }
    setResetLoading(false);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    try {
      const res = await axios.post(
        `${backendUrl}/reset-password`,
        { token: resetToken, password: resetNewPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      if (res.data && res.data.message?.toLowerCase().includes("success")) {
        toast.success("Password reset successfully. Please login.");
        setShowReset(false);
        setResetStep(1);
        setResetEmail("");
        setResetToken("");
        setResetOtp("");
        setResetNewPassword("");
        setResetError("");
      } else {
        setResetError("Password reset failed");
      }
    } catch (err) {
      setResetError(
        err.response?.data?.message || "Password reset failed"
      );
    }
    setResetLoading(false);
  };

  // Password reset modal/component
  const renderResetForm = () => (
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center fade-in"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(5px)", zIndex: 1050 }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden"
        style={{ maxWidth: "450px", width: "90%", animation: "slideUp 0.3s ease-out" }}>

        <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-secondary">Reset Password</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => {
              setShowReset(false);
              setResetStep(1);
              setResetEmail("");
              setResetToken("");
              setResetOtp("");
              setResetNewPassword("");
              setResetError("");
            }}
          />
        </div>

        <div className="card-body p-4 pt-0">
          {/* Step Indicators */}
          <div className="d-flex justify-content-center mb-4">
            <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${resetStep >= 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px' }}>1</div>
            <div className="bg-light mx-2 align-self-center rounded-pill" style={{ width: '40px', height: '4px' }}>
              <div className="bg-primary h-100 rounded-pill" style={{ width: resetStep >= 2 ? '100%' : '0%', transition: 'all 0.3s' }}></div>
            </div>
            <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${resetStep >= 2 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px' }}>2</div>
            <div className="bg-light mx-2 align-self-center rounded-pill" style={{ width: '40px', height: '4px' }}>
              <div className="bg-primary h-100 rounded-pill" style={{ width: resetStep >= 3 ? '100%' : '0%', transition: 'all 0.3s' }}></div>
            </div>
            <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${resetStep >= 3 ? 'bg-primary text-white' : 'bg-light text-muted'}`} style={{ width: '32px', height: '32px' }}>3</div>
          </div>

          {resetError && (
            <div className="alert alert-danger shadow-sm py-2 small" role="alert">
              <i className="bi bi-exclamation-circle-fill me-2"></i>{resetError}
            </div>
          )}

          {resetStep === 1 && (
            <form onSubmit={handleResetEmailSubmit} className="fade-in">
              <p className="text-muted small mb-4 text-center">Enter your email address to receive a One-Time Password (OTP).</p>
              <div className="mb-4">
                <label htmlFor="resetEmail" className="form-label text-muted small fw-bold">EMAIL ADDRESS</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-envelope"></i></span>
                  <input
                    type="email"
                    id="resetEmail"
                    className="form-control form-control-lg bg-light border-start-0 ps-0"
                    placeholder="name@example.com"
                    required
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill" disabled={resetLoading}>
                {resetLoading ? "Sending Code..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {resetStep === 2 && (
            <form onSubmit={handleResetOtpSubmit} className="fade-in">
              <p className="text-muted small mb-4 text-center">We sent a code to <span className="fw-bold text-dark">{resetEmail}</span></p>
              <div className="mb-4">
                <label htmlFor="resetOtp" className="form-label text-muted small fw-bold">ENTER OTP</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-123"></i></span>
                  <input
                    type="text"
                    id="resetOtp"
                    className="form-control form-control-lg bg-light border-start-0 ps-0 letter-spacing-2"
                    placeholder="Enter 6-digit code"
                    required
                    value={resetOtp}
                    onChange={e => setResetOtp(e.target.value)}
                    style={{ letterSpacing: '0.2em', fontWeight: 'bold' }}
                    maxLength={6}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill" disabled={resetLoading}>
                {resetLoading ? "Verifying..." : "Verify & Continue"}
              </button>
              <div className="text-center mt-3">
                <button type="button" className="btn btn-link text-muted btn-sm text-decoration-none" onClick={() => setResetStep(1)}>Wrong email?</button>
              </div>
            </form>
          )}

          {resetStep === 3 && (
            <form onSubmit={handleResetPasswordSubmit} className="fade-in">
              <p className="text-muted small mb-4 text-center">Create a new strong password for your account.</p>
              <div className="mb-4">
                <label htmlFor="resetNewPassword" className="form-label text-muted small fw-bold">NEW PASSWORD</label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                  <input
                    type="password"
                    id="resetNewPassword"
                    className="form-control form-control-lg bg-light border-start-0 ps-0"
                    placeholder="Enter new password"
                    required
                    value={resetNewPassword}
                    onChange={e => setResetNewPassword(e.target.value)}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 btn-lg rounded-pill" disabled={resetLoading}>
                {resetLoading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center bg-light" style={{ paddingTop: '80px' }}>
      {showReset && renderResetForm()}
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="card-header bg-primary text-white p-4 text-center border-0">
          <h3 className="mb-0 fw-bold">Welcome Back</h3>
          <p className="mb-0 opacity-75 small">Login to continue your food journey</p>
        </div>

        <div className="card-body p-4 p-md-5">
          {apiError && (
            <div className="alert alert-danger shadow-sm rounded-3 d-flex align-items-center mb-4 fade-in" role="alert">
              <i className="bi bi-exclamation-octagon-fill me-2 fs-5"></i>
              <div className="small">{apiError}</div>
            </div>
          )}

          <form onSubmit={onSubmitHandler}>
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
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label htmlFor="password" className="form-label text-muted small fw-bold mb-0">Password</label>
                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none small"
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0 text-muted"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  id="password"
                  className="form-control form-control-lg bg-light border-start-0 ps-0"
                  placeholder="Enter your password"
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
                  Logging In...
                </>
              ) : "Login"}
            </button>
            <div className="mt-4 text-center">
              <p className="text-muted mb-0">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary fw-semibold text-decoration-none hover-shadow-sm">
                  Register here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;
