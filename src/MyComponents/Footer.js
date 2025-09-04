import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer className={`mt-auto py-4 ${theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"} border-top ${theme === "dark" ? "border-secondary" : "border-light"}`}>
      <div className="container">
        <div className="row align-items-center">
          {/* Profile Section with Circular Photo */}
          <div className="col-lg-4 col-md-6 text-center text-md-start mb-4 mb-md-0">
            <div className="d-flex flex-column align-items-center align-items-md-start">
              <div className="d-flex flex-column flex-md-row align-items-center mb-2">
                {/* Circular Photo with Hover Effect */}
                <div className="position-relative me-md-3 mb-2 mb-md-0">
                  <img 
                    src="/images/profile.jpg" 
                    alt="Suraj Badre" 
                    className="rounded-circle border border-3 border-primary profile-photo"
                    style={{ 
                      width: '120px', 
                      height: '120px', 
                      objectFit: 'cover',
                      transition: 'all 0.3s ease'
                    }}
                  />
                  {/* Online status indicator */}
                  <span 
                    className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-2 border-white"
                    style={{ width: '12px', height: '12px' }}
                  ></span>
                </div>
                <div className="text-center text-md-start">
                  <h5 className="mb-0 fw-bold">Suraj Badre Patil</h5>
                  <small className="text-muted">Full Stack Developer</small>
                </div>
              </div>
              <p className="mb-0 small text-center text-md-start">Python | Django | React | API Development</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-4 col-md-6 text-center mb-4 mb-md-0">
            <h6 className="text-uppercase fw-bold mb-3">Quick Links</h6>
            <div className="d-flex justify-content-center flex-wrap gap-3">
              <a href="/" className={`text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"} small hover-effect`}>
                Home
              </a>
              <a href="/cryptocurrency" className={`text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"} small hover-effect`}>
                Cryptocurrency
              </a>
              <a href="/wallet" className={`text-decoration-none ${theme === "dark" ? "text-light" : "text-dark"} small hover-effect`}>
                Wallet
              </a>
            </div>
          </div>

          {/* Connect / Socials */}
          <div className="col-lg-4 col-md-12 text-center text-md-end">
            <h6 className="text-uppercase fw-bold mb-3">Connect With Me</h6>
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              <a href="https://www.linkedin.com/in/suraj-badre/" target="_blank" rel="noreferrer" 
                 className={`${theme === "dark" ? "text-light" : "text-dark"} fs-5 social-icon`}>
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://github.com/badre-suraj-23/" target="_blank" rel="noreferrer" 
                 className={`${theme === "dark" ? "text-light" : "text-dark"} fs-5 social-icon`}>
                <i className="bi bi-github"></i>
              </a>
              <a href="https://twitter.com/BadreSuraj99703" target="_blank" rel="noreferrer" 
                 className={`${theme === "dark" ? "text-light" : "text-dark"} fs-5 social-icon`}>
                <i className="bi bi-twitter"></i>
              </a>
              <a href="mailto:badresuraj@gmail.com" 
                 className={`${theme === "dark" ? "text-light" : "text-dark"} fs-5 social-icon`}>
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className={`my-4 ${theme === "dark" ? "bg-secondary" : ""}`} />

        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 small">
              &copy; {new Date().getFullYear()} Made with ❤️ by Suraj Badre. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Hover effect for profile photo */
        .profile-photo:hover {
          transform: scale(1.05);
          box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
          cursor: pointer;
        }
        
        /* Hover effect for links */
        .hover-effect:hover {
          color: #007bff !important;
          transform: translateY(-2px);
          transition: all 0.3s ease;
        }
        
        /* Hover effect for social icons */
        .social-icon:hover {
          color: #007bff !important;
          transform: translateY(-3px);
          transition: all 0.3s ease;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .profile-photo {
            width: 100px !important;
            height: 100px !important;
          }
          
          .d-flex.flex-column.flex-md-row {
            flex-direction: column !important;
            text-align: center;
          }
          
          .text-md-start {
            text-align: center !important;
          }
        }
        
        @media (max-width: 576px) {
          .profile-photo {
            width: 80px !important;
            height: 80px !important;
          }
          
          .d-flex.justify-content-md-end {
            justify-content: center !important;
          }
          
          .text-md-end {
            text-align: center !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;