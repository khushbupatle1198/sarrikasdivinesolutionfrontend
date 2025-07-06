import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Contact.css';

const Contact = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  return (
    <div className="contact-container">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <div className="contact-page">
        <section className="contact-hero py-5">
          <div className="container text-center">
            <h1>Contact Sacred Space</h1>
            <p>Connect with us for divine guidance and numerology services</p>
          </div>
        </section>

        <section className="contact-map-section py-4">
          <div className="container-fluid px-0">
            <div className="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.701418818602!2d79.1495451!3d21.1244668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4b978d7046635%3A0x9ff7f6cb78764aad!2sSarika%20Shrirao!5e0!3m2!1sen!2sin!4v1750582133980!5m2!1sen!2sin" 
                allowFullScreen="" 
                loading="lazy"
                title="Sacred Space Location"
              ></iframe>
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
                  <p>sarika.shrirao@gmail.com</p>
                  <div className="social-links mt-3">
                    <a href="mailto:sarika.shrirao@gmail.com" className="btn btn-outline-primary">
                      <i className="bi bi-envelope-fill"></i> Send Email
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-4 mb-md-0 text-center">
                <div className="contact-info-item p-4">
                  <i className="bi bi-telephone fs-1 text-primary mb-3"></i>
                  <h3>Phone</h3>
                  <p>+91 90676 90333</p>
                  <div className="social-links mt-3">
                    <a href="tel:+919067690333" className="btn btn-outline-primary">
                      <i className="bi bi-telephone-fill"></i> Call Now
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-4 text-center">
                <div className="contact-info-item p-4">
                  <i className="bi bi-geo-alt fs-1 text-primary mb-3"></i>
                  <h3>Address</h3>
                  <p>37, Sarika Shrirao's The Grooming Station Academy,<br />
                  Near Jay Jalaram Nagar Society,<br />
                  Near Mata Mandir, Wathoda Layout,<br />
                  Nagpur, Maharashtra 440008</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <h3 className="mb-4">Connect With Us</h3>
              <div className="social-icons">
                <a href="https://www.facebook.com/share/16QZJFzfS2/" className="social-icon me-3" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.instagram.com/sarrikas_divine_solution?igsh=djRkc3Q0eWYyMG5n" className="social-icon me-3" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="https://youtube.com/@sarika.neuremologist?si=iNV_m-3RtMm0Ux5t" className="social-icon me-3" target="_blank" rel="noopener noreferrer">
                  <i className="bi bi-youtube"></i>
                </a>
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