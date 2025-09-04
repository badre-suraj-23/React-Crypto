import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  // Initialize Bootstrap JavaScript components
  useEffect(() => {
    // Load Bootstrap's JavaScript
    if (typeof window !== 'undefined') {
      // Import Bootstrap JavaScript
      const bootstrap = require('bootstrap');
      
      // Initialize all dropdowns
      const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
      const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
        return new bootstrap.Dropdown(dropdownToggleEl);
      });
      
      // Initialize all collapse elements
      const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
      const collapseList = collapseElementList.map(function (collapseEl) {
        return new bootstrap.Collapse(collapseEl);
      });
    }
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${theme === "light" ? "navbar-light bg-light shadow-sm" : "navbar-dark bg-dark shadow-sm"}`}>
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-currency-bitcoin me-2"></i>
          Crypto Tracker
        </Link>
        
        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Navigation Links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                <i className="bi bi-house me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/cryptocurrency' ? 'active' : ''}`} 
                to="/cryptocurrency"
              >
                <i className="bi bi-graph-up me-1"></i> Cryptocurrency
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/wallet' ? 'active' : ''}`} 
                to="/wallet"
              >
                <i className="bi bi-wallet2 me-1"></i> Wallet
              </Link>
            </li>
            {/* News Link */}
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} 
                to="/news"
              >
                <i className="bi bi-newspaper me-1"></i> News
              </Link>
            </li>
          </ul>
          
          {/* Right Side Items */}
          <div className="d-flex align-items-center flex-column flex-lg-row">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="btn btn-link text-decoration-none me-0 me-lg-3 mb-2 mb-lg-0"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Authentication Button */}
            {user ? (
              <div className="d-flex align-items-center flex-column flex-lg-row gap-2">
                <span className="fw-bold text-primary text-center mb-2 mb-lg-0">
                  <i className="bi bi-person-circle me-1"></i>
                  {user.username || user.email}
                </span>
                <button 
                  className="btn btn-outline-danger d-flex align-items-center"
                  onClick={logout}
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="btn btn-outline-success d-flex align-items-center"
              >
                <i className="bi bi-box-arrow-in-right me-1"></i> 
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// import React, { useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import { Moon, Sun } from "lucide-react";

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const { theme, toggleTheme } = useTheme();
//   const location = useLocation();

//   // Initialize Bootstrap JavaScript components
//   useEffect(() => {
//     // Load Bootstrap's JavaScript
//     if (typeof window !== 'undefined') {
//       // Import Bootstrap JavaScript
//       const bootstrap = require('bootstrap');
      
//       // Initialize all dropdowns
//       const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
//       const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
//         return new bootstrap.Dropdown(dropdownToggleEl);
//       });
      
//       // Initialize all collapse elements
//       const collapseElementList = [].slice.call(document.querySelectorAll('.collapse'));
//       const collapseList = collapseElementList.map(function (collapseEl) {
//         return new bootstrap.Collapse(collapseEl);
//       });
//     }
//   }, []);

//   return (
//     <nav className={`navbar navbar-expand-lg fixed-top ${theme === "light" ? "navbar-light bg-light shadow-sm" : "navbar-dark bg-dark shadow-sm"}`}>
//       <div className="container-fluid">
//         {/* Brand Logo */}
//         <Link className="navbar-brand fw-bold" to="/">
//           <i className="bi bi-currency-bitcoin me-2"></i>
//           Crypto Tracker
//         </Link>
        
//         {/* Mobile Toggle Button */}
//         <button 
//           className="navbar-toggler" 
//           type="button" 
//           data-bs-toggle="collapse" 
//           data-bs-target="#navbarContent"
//           aria-controls="navbarContent" 
//           aria-expanded="false" 
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
        
//         {/* Navbar Content */}
//         <div className="collapse navbar-collapse" id="navbarContent">
//           {/* Navigation Links */}
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item">
//               <Link 
//                 className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
//                 to="/"
//               >
//                 <i className="bi bi-house me-1"></i> Home
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link 
//                 className={`nav-link ${location.pathname === '/cryptocurrency' ? 'active' : ''}`} 
//                 to="/cryptocurrency"
//               >
//                 <i className="bi bi-graph-up me-1"></i> Cryptocurrency
//               </Link>
//             </li>
//             <li className="nav-item">
//               <Link 
//                 className={`nav-link ${location.pathname === '/wallet' ? 'active' : ''}`} 
//                 to="/wallet"
//               >
//                 <i className="bi bi-wallet2 me-1"></i> Wallet
//               </Link>
//             </li>
//             {/* News Link */}
//             <li className="nav-item">
//               <Link 
//                 className={`nav-link ${location.pathname === '/news' ? 'active' : ''}`} 
//                 to="/news"
//               >
//                 <i className="bi bi-newspaper me-1"></i> News
//               </Link>
//             </li>
//           </ul>
          
//           {/* Right Side Items */}
//           <div className="d-flex align-items-center flex-column flex-lg-row">
//             {/* Theme Toggle Button */}
//             <button 
//               onClick={toggleTheme} 
//               className="btn btn-link text-decoration-none me-0 me-lg-3 mb-2 mb-lg-0"
//               aria-label="Toggle theme"
//             >
//               {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
//             </button>

//             {/* Authentication Button */}
//             {user ? (
//               <div className="d-flex align-items-center flex-column flex-lg-row gap-2">
//                 <span className="fw-bold text-primary text-center mb-2 mb-lg-0">
//                   <i className="bi bi-person-circle me-1"></i>
//                   {user.username || user.email}
//                 </span>
//                 <button 
//                   className="btn btn-outline-danger d-flex align-items-center"
//                   onClick={logout}
//                 >
//                   <i className="bi bi-box-arrow-right me-1"></i> Logout
//                 </button>
//               </div>
//             ) : (
//               <Link 
//                 to="/login" 
//                 className="btn btn-outline-success d-flex align-items-center"
//               >
//                 <i className="bi bi-box-arrow-in-right me-1"></i> 
//                 <span>Login</span>
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;