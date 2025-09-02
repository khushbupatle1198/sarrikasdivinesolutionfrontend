import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ navbarScrolled, navbarVisible }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const closeMenu = () => {
    setIsExpanded(false);
  };

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${navbarScrolled ? 'navbar-scrolled' : ''} ${navbarVisible ? 'navbar-visible' : 'navbar-hidden'}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeMenu}>
          <img 
            src="https://www.sarrikasdivinesolution.com/logo.png" 
            alt="Sarrika Logo" 
            className={`navbar-logo ${navbarScrolled ? 'scrolled-logo' : ''}`} 
          />
          <span className="brand-text">Sarrika's Divine Solution</span>
        </Link>
        
        <div className="navbar-toggler-container">
          <button 
            className="navbar-toggler" 
            type="button" 
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        
        <div className={`collapse navbar-collapse ${isExpanded ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={closeMenu}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/courses" onClick={closeMenu}>Courses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/consultation" onClick={closeMenu}>Consultation</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ereport" onClick={closeMenu}>EReport</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/blog" onClick={closeMenu}>Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact" onClick={closeMenu}>Contact</Link>
            </li>
          </ul>
          <div className="d-flex ms-lg-3">
            <Link to="/login" className="btn btn-primary btn-glow me-2" onClick={closeMenu}>Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
