import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import FloatingLogos from '../MyComponents/FloatingLogos';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Only pass email and password to register function (no username)
    const result = await register(formData.email, formData.password);
    setIsLoading(false);
    
    if (result.success) {
      setSuccessMessage('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <div className={`min-vh-100 d-flex align-items-center justify-content-center ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark'}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Add floating animation */}
      <FloatingLogos />
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className={`card ${theme === 'dark' ? 'bg-secondary text-light' : 'bg-white text-dark'} shadow-lg border-0`} style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4">Create Account</h2>
                <p className="text-center text-muted mb-4">Join our community today</p>
                
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label" style={{ color: theme === "dark" ? "white" : "black" }}>Email</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      style={{ backgroundColor: theme === "dark" ? "#2d3748" : "white", color: theme === "dark" ? "white" : "black" }}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label" style={{ color: theme === "dark" ? "white" : "black" }}>Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        style={{ backgroundColor: theme === "dark" ? "#2d3748" : "white", color: theme === "dark" ? "white" : "black" }}
                      />
                      <button 
                        className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-secondary"}`} 
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </button>
                      {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label" style={{ color: theme === "dark" ? "white" : "black" }}>Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        style={{ backgroundColor: theme === "dark" ? "#2d3748" : "white", color: theme === "dark" ? "white" : "black" }}
                      />
                      <button 
                        className={`btn ${theme === "dark" ? "btn-outline-light" : "btn-outline-secondary"}`} 
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <i className="bi bi-eye-slash"></i>
                        ) : (
                          <i className="bi bi-eye"></i>
                        )}
                      </button>
                      {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                    </div>
                  </div>
                  
                  {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 fw-bold"
                    disabled={isLoading}
                    style={{ borderRadius: '8px' }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>
                
                <p className="text-center mt-4 mb-0" style={{ color: theme === "dark" ? "white" : "black" }}>
                  Already have an account? <Link to="/login" style={{ color: theme === "dark" ? "#0dcaf0" : "#0d6efd" }}>Log in</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;