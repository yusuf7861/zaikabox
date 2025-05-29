import axios from "axios";
// import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext.jsx";
import { useState } from "react";


const Login = () => {

  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/v1/users/login", FormData);
      if (response.status === 200) {
        setLoading(false);
        toast.success("Login successful");
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
      return;
    }

  }


    return (
        <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
    >
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Login</h2>
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
