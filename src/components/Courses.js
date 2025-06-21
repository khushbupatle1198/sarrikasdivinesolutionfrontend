import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Courses.css';

const Courses = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Static courses data
  const courses = [
    {
      id: 1,
      title: "Numerology Foundation Course",
      level: "Beginner",
      duration: "4 Weeks",
      price: "₹4999",
      description: "Learn the basics of numerology including life path numbers, destiny numbers, and core calculations.",
      logoUrl: "course1.jpg"
    },
    {
      id: 2,
      title: "Advanced Numerology Certification",
      level: "Advanced",
      duration: "8 Weeks",
      price: "₹9999",
      description: "Master advanced techniques including name analysis, forecasting, and relationship compatibility.",
      logoUrl: "course2.jpg"
    },
    {
      id: 3,
      title: "Business Numerology Masterclass",
      level: "Professional",
      duration: "6 Weeks",
      price: "₹7999",
      description: "Apply numerology to business decisions, branding, and strategic planning.",
      logoUrl: "course3.jpg"
    },
    {
      id: 4,
      title: "Numerology for Relationships",
      level: "Intermediate",
      duration: "3 Weeks",
      price: "₹3999",
      description: "Understand compatibility and relationship dynamics through numerology.",
      logoUrl: "course4.jpg"
    },
    {
      id: 5,
      title: "Predictive Numerology",
      level: "Advanced",
      duration: "5 Weeks",
      price: "₹6999",
      description: "Learn to forecast personal years, months, and days using numerology cycles.",
      logoUrl: "course5.jpg"
    },
    {
      id: 6,
      title: "Numerology Practitioner Certification",
      level: "Professional",
      duration: "12 Weeks",
      price: "₹14999",
      description: "Become a certified numerology practitioner with this comprehensive program.",
      logoUrl: "course6.jpg"
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
                          src={`/images/${course.logoUrl}`} 
                          alt={course.title}
                          className="img-fluid"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="course-content">
                      <div className="course-badge">
                        <span className="level-badge">{course.level}</span>
                      </div>
                      <div className="course-header">
                        <h3>{course.title}</h3>
                        <div className="course-meta">
                          <span className="duration">{course.duration}</span>
                          <span className="price">{course.price}</span>
                        </div>
                      </div>
                      <div className="course-body">
                        <p>{course.description}</p>
                      </div>
                      <div className="course-footer">
                        <button className="btn-enroll">
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