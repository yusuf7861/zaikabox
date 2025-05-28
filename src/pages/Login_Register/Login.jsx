import axios from "axios";
// import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../../context/AppContext.jsx";
import { useState } from "react";


const Login = () => {
    const navigate = useNavigate();
  const [isCreateAccount, setIsCreateAccount] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    setLoading(true);
    try {
      if (isCreateAccount) {
        // register API
        const response = await axios.post('http://localhost:8080/api/v1/users/register', {name, email, password})
        if (response.status === 201) {
          navigate("/login")
          toast.success("Account created successfully");
        } else {
          toast.success("Email already exists.")
        }
      } else {
        // Login API
          const response = await axios.post('http://localhost:8080/api/v1/users/register', {email, password})
          if (response.status === 200) {
            //   setIsLoggedIn(true);
            //   getUserData();
              navigate("/");
              toast.success("Logged In successfully")
          } else {
              toast.error("Email or password is incorrect")
          }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }


    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
            style={{background: "linear-gradient(90deg, #8268f9)", border: "none"}}
        >
          <div className="card p-4" style={{maxWidth: "400px", width: "100%"}}>
            <h2 className="text-center mb-4">
              {isCreateAccount ? "Create Account" : "Login"}
            </h2>
            <form onSubmit={onSubitHandler}>
              {isCreateAccount && (
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        className="form-control"
                        placeholder="Enter full name"
                        required
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                  </div>
              )}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                    type="text"
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
                {loading ? "Your credentials are stuck in Delhi traffic..." : isCreateAccount ? "SignUp" : "Login"}
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="mb-0">
                {isCreateAccount
                    ? "Already have an account?"
                    : "Don't have an account?"}
                <button
                    className="btn btn-link text-decoration-none"
                    onClick={() => setIsCreateAccount(!isCreateAccount)}
                >
                  {isCreateAccount ? "Login" : "Create Account"}
                </button>
              </p>
            </div>
          </div>
          {/* </div> */}
        </div>
    );
  };
export default Login;
