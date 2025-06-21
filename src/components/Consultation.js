import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Consultation.css';

const Consultation = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [selectedService, setSelectedService] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    question: ''
  });

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

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for your consultation request! We'll contact you shortly about your ${selectedService} numerology reading.`);
    setFormData({
      name: '',
      email: '',
      phone: '',
      birthdate: '',
      question: ''
    });
  };

  const consultationServices = [
    {
      id: 'basic',
      title: 'Basic Numerology Reading',
      duration: '30 min',
      price: '₹1,499',
      features: [
        'Life Path Number Analysis',
        'Destiny Number Calculation',
        'Basic Personality Insights',
        'General Year Forecast'
      ]
    },
    {
      id: 'advanced',
      title: 'Advanced Numerology Report',
      duration: '60 min',
      price: '₹2,999',
      features: [
        'Complete Core Numbers Analysis',
        'Karmic Debt Numbers',
        'Personal Year/Month Forecast',
        'Compatibility Analysis',
        'Career Guidance'
      ]
    },
    {
      id: 'premium',
      title: 'Premium Numerology Package',
      duration: '90 min',
      price: '₹4,999',
      features: [
        'All Advanced Features Plus',
        'Name Vibration Analysis',
        'Business/Financial Guidance',
        'Detailed Future Timeline',
        '3 Follow-up Sessions'
      ]
    }
  ];

  return (
    <div className="consultation-container">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <div className="consultation-page">
        <section className="consultation-hero py-5">
          <div className="container text-center">
            <h1>Numerology Consultation</h1>
            <p>Discover the hidden messages in your numbers with our expert numerologists</p>
          </div>
        </section>

        <section className="services-section py-5">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="section-title">Choose Your Consultation</h2>
                <p className="section-subtitle">Select the service that resonates with your needs</p>
              </div>
            </div>
            
            <div className="row g-4">
              {consultationServices.map((service) => (
                <div key={service.id} className="col-md-4">
                  <div 
                    className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <h3>{service.title}</h3>
                    <div className="service-meta">
                      <span className="duration">{service.duration}</span>
                      <span className="price">{service.price}</span>
                    </div>
                    <ul className="service-features">
                      {service.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                    <div className="service-select">
                      {selectedService === service.id ? '✓ Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="consultation-form-section py-5 bg-light">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="consultation-form-card p-4 p-md-5 shadow">
                  <h2 className="text-center mb-4">Book Your Session</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label htmlFor="name">Full Name *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label htmlFor="email">Email Address *</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label htmlFor="phone">Phone Number *</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label htmlFor="birthdate">Birth Date *</label>
                          <input
                            type="date"
                            className="form-control"
                            id="birthdate"
                            name="birthdate"
                            value={formData.birthdate}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="form-group">
                        <label htmlFor="question">Your Specific Question (Optional)</label>
                        <textarea
                          className="form-control"
                          id="question"
                          name="question"
                          rows="3"
                          value={formData.question}
                          onChange={handleChange}
                          placeholder="Any specific area you'd like us to focus on?"
                        ></textarea>
                      </div>
                    </div>
                    <div className="selected-service mb-4">
                      <h5>Selected Service:</h5>
                      <p>{consultationServices.find(s => s.id === selectedService).title}</p>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-lg px-5">
                        Book Consultation
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="numerologists-section py-5">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="section-title">Our Master Numerologists</h2>
              </div>
            </div>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="numerologist-card">
                  <div className="numerologist-img">
                    <div className="img-placeholder">1</div>
                  </div>
                  <h3>Sarrika Devi</h3>
                  <p className="specialty">Life Path & Destiny Expert</p>
                  <p className="experience">15+ years experience</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="numerologist-card">
                  <div className="numerologist-img">
                    <div className="img-placeholder">7</div>
                  </div>
                  <h3>Rahul Sharma</h3>
                  <p className="specialty">Business & Career Numerology</p>
                  <p className="experience">12 years experience</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="numerologist-card">
                  <div className="numerologist-img">
                    <div className="img-placeholder">9</div>
                  </div>
                  <h3>Priya Patel</h3>
                  <p className="specialty">Relationship Compatibility</p>
                  <p className="experience">10 years experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
};

export default Consultation;