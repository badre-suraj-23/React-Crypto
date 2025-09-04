import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; 
import "bootstrap/dist/css/bootstrap.min.css";
import FloatingLogos from '../MyComponents/FloatingLogos';
const Login = () => {
  const { login } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get the intended destination or default to home
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Redirect to the intended page or home
      navigate(from, { replace: true });
    } else {
      setError(result.message || "❌ Invalid email or password");
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Add floating animation */}
      <FloatingLogos />
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className={`card ${theme === "dark" ? "bg-secondary text-light" : "bg-white text-dark"} shadow-lg border-0`} style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4">Login</h2>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{ color: theme === "dark" ? "white" : "black" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      autoFocus
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ backgroundColor: theme === "dark" ? "#2d3748" : "white", color: theme === "dark" ? "white" : "black" }}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label" style={{ color: theme === "dark" ? "white" : "black" }}>
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ backgroundColor: theme === "dark" ? "#2d3748" : "white", color: theme === "dark" ? "white" : "black" }}
                      />
                      <button 
                        className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-secondary"}`} 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={loading}
                    style={{ borderRadius: '8px' }}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <p style={{ color: theme === "dark" ? "white" : "black" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: theme === "dark" ? "#0dcaf0" : "#0d6efd" }}>Register here</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;