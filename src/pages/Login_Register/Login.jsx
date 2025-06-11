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
  }


    return (
        <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
    >
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
            <Link to="/reset-password" className="text-decoration-none">
              Forgot password?
            </Link>
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
