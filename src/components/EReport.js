import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './EReport.css';

const EReportCards = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Static report data
  const eReports = [
    {
      id: 1,
      title: "Personal Numerology Report",
      price: "999",
      description: "Discover your life path number and its profound meaning in your personal journey.",
      points: [
        "Detailed analysis of your core numbers",
        "Life path number interpretation",
        "Personality and hidden talents",
        "Challenges and opportunities",
        "Yearly numerology forecast"
      ],
      imageUrl: "numerology1.jpg"
    },
    {
      id: 2,
      title: "Relationship Compatibility Report",
      price: "1299",
      description: "Understand the numerology behind your relationships and compatibility with others.",
      points: [
        "Compatibility score with partner",
        "Communication style analysis",
        "Relationship challenges",
        "Growth opportunities",
        "Future relationship forecast"
      ],
      imageUrl: "numerology2.jpg"
    },
    {
      id: 3,
      title: "Business Numerology Report",
      price: "1999",
      description: "Align your business with the right numbers for success and prosperity.",
      points: [
        "Business name analysis",
        "Launch date recommendations",
        "Lucky numbers for business",
        "Financial forecast",
        "Best partnerships"
      ],
      imageUrl: "numerology3.jpg"
    },
    {
      id: 4,
      title: "Yearly Forecast Report",
      price: "799",
      description: "Get insights into what your personal year holds based on numerology.",
      points: [
        "Personal year number analysis",
        "Monthly breakdown",
        "Important dates to watch",
        "Career opportunities",
        "Health and wellness guidance"
      ],
      imageUrl: "numerology4.jpg"
    },
    {
      id: 5,
      title: "Name Correction Report",
      price: "2499",
      description: "Optimize your name's vibration to attract success and happiness.",
      points: [
        "Current name analysis",
        "Vibration correction",
        "Suggested name changes",
        "Impact on life areas",
        "Implementation guidance"
      ],
      imageUrl: "numerology5.jpg"
    },
    {
      id: 6,
      title: "Destiny & Career Report",
      price: "1499",
      description: "Align your career path with your soul's purpose using numerology.",
      points: [
        "Destiny number analysis",
        "Ideal career paths",
        "Work environment needs",
        "Financial potential",
        "Career timing"
      ],
      imageUrl: "numerology6.jpg"
    }
  ];

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

  useState(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
                    src={`/images/${report.imageUrl}`} 
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
                  <button className="card-button">
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