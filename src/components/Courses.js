import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import config from "../config";
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate(); // Add this line
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [courses, setCourses] = useState([]);
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
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/getCourses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="courses-container">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <div className="courses-page">
        <section className="courses-list py-5">
          <div className="container">
            <div className="row">
              <div className="col-12 text-center mb-5">
                <h2 className="section-title">Our Numerology Courses</h2>
                <p className="section-subtitle">Unlock the secrets of numbers with our expert-led programs</p>
              </div>
            </div>
            
            <div className="row g-4">
              {courses.map((course) => (
                <div key={course.id} className="col-md-6 col-lg-4">
                  <div className="modern-course-card">
                    {course.logoUrl && (
                      <div className="course-image">
                        <img 
                          src={`${config.API_BASE_URL}/uploads/CourseLogo/${course.logoUrl}`} 
                          alt={course.title}
                          className="img-fluid"
                        />
                      </div>
                    )}
                    <div className="course-content">
                      <div className="course-badge">
                        <span className="level-badge">{course.level || 'Popular'}</span>
                      </div>
                      <div className="course-header">
                        <h3>{course.title}</h3>
                        <div className="course-meta">
                          <span className="duration">{course.duration || 'Self-paced'}</span>
                          <span className="price">{course.price || 'Contact for pricing'}</span>
                        </div>
                      </div>
                      <div className="course-body">
                        <p>{course.description}</p>
                      </div>
                      <div className="course-footer">
                        <button 
                          className="btn-enroll"
                          onClick={() => navigate('/purchase-course', { state: { course } })}
                        >
                          <span>Enroll Now</span>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
};

export default Courses;
