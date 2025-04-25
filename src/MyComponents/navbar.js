import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-white px-4 py-2 shadow-sm position-sticky top-0 z-index-100">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand fw-bold" to="/">Energi</Link>

        <ul className="navbar-nav d-flex flex-row gap-3 align-items-center mb-0">
          <li className={`nav-item ${location.pathname === '/' ? 'active border-bottom border-success' : ''}`}>
            <Link className="nav-link d-flex align-items-center gap-1" to="/">
              <i className="bi bi-house"></i> Home
            </Link>
          </li>
          <li className={`nav-item ${location.pathname === '/wallet' ? 'active border-bottom border-success' : ''}`}>
            <Link className="nav-link d-flex align-items-center gap-1" to="/wallet">
              <i className="bi bi-wallet2"></i> Wallet
            </Link>
          </li>
        </ul>

        <button onClick={toggleTheme} className="btn btn-link">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
