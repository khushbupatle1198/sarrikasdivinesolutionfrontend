import React from 'react';
import {  useNavigate } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();

  // Function to handle navigation
  const handleNavigate = (path) => {
    navigate(path);
    // Scroll to top after navigation
    window.scrollTo(0, 0);
  };

  return (
    <footer className="footer bg-dark text-white pt-7 pb-4">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4">
            <div className="footer-brand mb-4">
              <img src="/logo.png" alt="Sarrika Logo" className="navbar-logo" />
              <span className="h3 mb-0">Sarrika's Divine Solution</span>
            </div>
            <p className="mb-4">
              Bringing divine light to your spiritual journey since 2008
            </p>
            <div className="social-links mb-4">
              <a href="https://www.facebook.com/share/16QZJFzfS2/" className="text-white me-3" target="_blank" rel="noopener noreferrer"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/sarrikas_divine_solution?igsh=djRkc3Q0eWYyMG5n" className="text-white me-3" target="_blank" rel="noopener noreferrer"><i className="bi bi-instagram"></i></a>
              <a href="https://youtube.com/@sarika.neuremologist?si=iNV_m-3RtMm0Ux5t" className="text-white me-3" target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube"></i></a>
            </div>
            <div className="newsletter">
              <h5 className="mb-3">Subscribe to Our Newsletter</h5>
              <div className="input-group mb-3">
                <input type="email" className="form-control" placeholder="Your sacred email" />
                <button className="btn btn-primary" type="button">Subscribe</button>
              </div>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-4">
            <h5 className="mb-4">Quick Links</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  Home
                </button>
              </li>
              <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/courses')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  Courses
                </button>
              </li>
              <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/consultation')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  Consultation
                </button>
              </li>
              <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/ereport')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  EReport
                </button>
              </li>
              <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/blog')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  Blog
                </button>
              </li>
              <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/userdashboard')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  User Dash
                </button>
              </li>
               <li className="nav-item mb-2">
                <button onClick={() => handleNavigate('/admindash')} className="nav-link p-0 text-white-50 bg-transparent border-0 text-start">
                  Admin Dash
                </button>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <h5 className="mb-4">Contact Us</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <a href="mailto:divine@sarrikasolutions.com" className="nav-link p-0 text-white-50">
                  <i className="bi bi-envelope me-2"></i> divine@sarrikasolutions.com
                </a>
              </li>
              <li className="nav-item mb-2">
                <a href="tel:+919067690333" className="nav-link p-0 text-white-50">
                  <i className="bi bi-telephone me-2"></i> +91 90676 90333
                </a>
              </li>
              <li className="nav-item mb-2">
                <a 
                  href="https://maps.google.com?q=108 Divine Lane, Rishikesh, India" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav-link p-0 text-white-50"
                >
                  <i className="bi bi-geo-alt me-2"></i> 108 Divine Lane, Rishikesh, India
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-lg-3 col-md-4">
            <h5 className="mb-4">Opening Hours</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2 text-white-50">Monday - Friday: 9AM - 6PM</li>
              <li className="nav-item mb-2 text-white-50">Saturday: 10AM - 4PM</li>
              <li className="nav-item mb-2 text-white-50">Sunday: Closed</li>
              <li className="nav-item mb-2 text-white-50">Emergency consultations available 24/7</li>
            </ul>
          </div>
        </div>
        
        <div className="border-top border-secondary mt-5 pt-4">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <p className="mb-0 text-white-50">
                &copy; {new Date().getFullYear()} Sarrika's Divine Solution. All Rights Reserved.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <ul className="nav justify-content-md-end">
                <li className="nav-item ms-3">
                  <button onClick={() => handleNavigate('/privacy')} className="nav-link p-0 text-white-50 bg-transparent border-0">
                    Privacy Policy
                  </button>
                </li>
                <li className="nav-item ms-3">
                  <button onClick={() => handleNavigate('/terms')} className="nav-link p-0 text-white-50 bg-transparent border-0">
                    Terms of Service
                  </button>
                </li>
                <li className="nav-item ms-3">
                  <button onClick={() => handleNavigate('/refund')} className="nav-link p-0 text-white-50 bg-transparent border-0">
                    Refund Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;