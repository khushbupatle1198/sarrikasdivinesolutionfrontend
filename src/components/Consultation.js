import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Consultation.css';
import config from "../config";



const Consultation = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    const fetchConsultations = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/Allconsultations`);
        if (!response.ok) {
          throw new Error('Failed to fetch consultations');
        }
        const data = await response.json();
        setConsultations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleBookNow = (consultation) => {
    navigate('/consultationbooking', { 
      state: { 
        consultation: consultation 
      } 
    });
  };

  if (loading) {
    return (
      <div className="consultation-loading">
        <div className="consultation-spinner"></div>
        <p>Loading consultations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="consultation-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="consultation-page-container">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <main className="consultation-main-content">
        {/* Hero Section with Modern Background */}
        <section className="consultation-hero-section">
          <div className="consultation-hero-overlay"></div>
          <div className="consultation-hero-content">
            <h1>Numerology Consultations</h1>
            <p>Unlock the hidden potential in your numbers with our expert guidance</p>
          </div>
        </section>

        {/* Consultation Services Section */}
        <section className="consultation-services-section">
          <div className="consultation-container">
            <div className="consultation-section-header">
              <h2>Our Consultation Services</h2>
              <p>Personalized readings based on your unique numerological profile</p>
            </div>
            
            <div className="consultation-services-grid">
              {consultations.map((consultation) => (
                <div key={consultation.id} className="consultation-service-card">
                  {consultation.imageUrl && (
                    <div className="consultation-service-image">
                      <img 
                        src={`${config.API_BASE_URL}/uploads/ConsultationImages/${consultation.imageUrl}`} 
                        alt={consultation.title}
                      />
                    </div>
                  )}
                  <div className="consultation-service-content">
                    <h3>{consultation.title}</h3>
                    <div className="consultation-service-price">{consultation.price}</div>
                    <p className="consultation-service-description">{consultation.description}</p>
                    <button 
                      className="consultation-service-button"
                      onClick={() => handleBookNow(consultation)}
                    >
                      Book Now
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
};

export default Consultation;
