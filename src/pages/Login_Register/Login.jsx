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
    <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.3)", zIndex: 1000 }}>
      <div className="card p-4" style={{ maxWidth: 400, width: "100%" }}>
        <button
          className="btn-close ms-auto mb-2"
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
        <h4 className="mb-3 text-center">Reset Password</h4>
        {resetError && (
          <div className="alert alert-danger" role="alert">
            {resetError}
          </div>
        )}
        {resetStep === 1 && (
          <form onSubmit={handleResetEmailSubmit}>
            <div className="mb-3">
              <label htmlFor="resetEmail" className="form-label">Email</label>
              <input
                type="email"
                id="resetEmail"
                className="form-control"
                placeholder="Enter your email"
                required
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={resetLoading}>
              {resetLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
        {resetStep === 2 && (
          <form onSubmit={handleResetOtpSubmit}>
            <div className="mb-3">
              <label htmlFor="resetOtp" className="form-label">OTP</label>
              <input
                type="text"
                id="resetOtp"
                className="form-control"
                placeholder="Enter OTP"
                required
                value={resetOtp}
                onChange={e => setResetOtp(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={resetLoading}>
              {resetLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
        {resetStep === 3 && (
          <form onSubmit={handleResetPasswordSubmit}>
            <div className="mb-3">
              <label htmlFor="resetNewPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="resetNewPassword"
                className="form-control"
                placeholder="Enter new password"
                required
                value={resetNewPassword}
                onChange={e => setResetNewPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={resetLoading}>
              {resetLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );

  return (
    <div className="position-relative min-vh-100 d-flex justify-content-center align-items-center">
      {showReset && renderResetForm()}
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>
        {/* Show API error if it exists */}
        {apiError && (
          <div className="alert alert-danger" role="alert">
            {apiError}
          </div>
        )}
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Enter email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="*********"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="d-flex justify-content-between mb-3">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none"
              style={{ fontSize: "1rem" }}
              onClick={() => setShowReset(true)}
            >
              Forgot password?
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Loading..." : "Login"}
          </button>
          <div className="mt-3 text-center">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
