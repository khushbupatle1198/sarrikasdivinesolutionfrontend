import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import config from '../config';
import './EReport.css';

const EReportCards = () => {
  const navigate = useNavigate();
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [eReports, setEReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchEReports = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/Allereports`);
        if (!response.ok) {
          throw new Error('Failed to fetch E-Reports');
        }
        const data = await response.json();
        setEReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEReports();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading E-Reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <p>Error: {error}</p>
      </div>
    );
  }

  const handleGetReport = (eReport) => {
    navigate('/ereportbooking', { 
      state: { 
        eReport: eReport 
      } 
    });
  };

  return (
    <div className="cosmic-container">
      {/* Cosmic Background Elements */}
      <div className="cosmic-bg"></div>
      <div className="stars"></div>
      <div className="twinkling"></div>
      <div className="numerology-grid"></div>
      
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <main className="cosmic-content">
        <section className="cosmic-header">
          <div className="header-content">
            <h2 className="section-subtitle">Numerology Energy Reports</h2>
            <h1 className="section-title">
              <span className="title-gradient">Discover Your</span>
              <span className="title-gradient">Cosmic Blueprint</span>
            </h1>
            <p className="section-description">
              Personalized insights based on your birth numbers to guide your spiritual journey
            </p>
          </div>
        </section>

        <section className="cosmic-grid">
          <div className="grid-container">
            {eReports.map((report) => (
              <div key={report.id} className="cosmic-card">
                <div className="card-image-container">
                  <img 
                    src={`${config.API_BASE_URL}/uploads/EReportImages/${report.imageUrl}`} 
                    alt={report.title}
                    className="card-image"
                    loading="lazy"
                  />
                  <div className="image-overlay"></div>
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <h3>{report.title}</h3>
                    <span className="card-price">₹{report.price}</span>
                  </div>
                  <p className="card-description">{report.description}</p>
                  <ul className="card-points">
                    {report.points.map((point, i) => (
                      <li key={i}>
                        <span className="point-icon">✧</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <button 
  className="card-button"
  onClick={() => handleGetReport(report)}
>
  Get Report
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
};

export default EReportCards;