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

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    setLoading(true);
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
        toast.error(err.response.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
    >
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-4">Create Account</h2>
        <form onSubmit={onSubmitHandler}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your name"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
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

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
          
          <div className="mt-3 text-center">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Login here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;