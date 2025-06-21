import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Navbar background change
      if (currentScrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
      
      // Hide/show navbar on scroll direction
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message. Our numerologists will contact you soon!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <div className="contact-page">
        <section className="contact-hero py-5">
          <div className="container text-center">
            <h1>Numerology Consultation</h1>
            <p>Discover the hidden meanings in your numbers</p>
          </div>
        </section>

        <section className="contact-form-section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="contact-form-card p-4 p-md-5 shadow">
                  <h2 className="text-center mb-4">Get Your Numerology Report</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <div className="form-group">
                          <label htmlFor="name">Full Name</label>
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
                          <label htmlFor="email">Email Address</label>
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
                    <div className="mb-4">
                      <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <small className="text-muted">Important for numerology calculations</small>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="form-group">
                        <label htmlFor="birthdate">Birth Date</label>
                        <input
                          type="date"
                          className="form-control"
                          id="birthdate"
                          name="birthdate"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="form-group">
                        <label htmlFor="message">Your Questions</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Any specific areas you want us to focus on?"
                        ></textarea>
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-lg px-5">
                        Calculate My Numbers
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-info py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4 mb-md-0 text-center">
                <div className="contact-info-item p-4">
                  <i className="bi bi-envelope fs-1 text-primary mb-3"></i>
                  <h3>Email</h3>
                  <p>numerology@sarrikasolutions.com</p>
                </div>
              </div>
              <div className="col-md-4 mb-4 mb-md-0 text-center">
                <div className="contact-info-item p-4">
                  <i className="bi bi-telephone fs-1 text-primary mb-3"></i>
                  <h3>Phone</h3>
                  <p>+91 98765 43210</p>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="contact-info-item p-4">
                  <i className="bi bi-geo-alt fs-1 text-primary mb-3"></i>
                  <h3>Address</h3>
                  <p>108 Numerology Center, Rishikesh</p>
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

export default Contact;