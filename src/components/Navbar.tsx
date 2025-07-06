import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { ThemeContext } from '../App.tsx';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">MovieFlix</span>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/movies" className="nav-link">Movies</Link>
          </li>
          <li className="nav-item">
            <Link to="/watchlist" className="nav-link">My List</Link>
          </li>
        </ul>
        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 