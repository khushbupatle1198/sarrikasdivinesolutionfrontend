import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import config from '../config';
import './Home.css';

const Home = () => {
  // Banner state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  // New state for courses
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  
  const banners = [
    { 
      image: "/1.png", 
      
    },
    { 
      image: "/2.png", 
      
    },
    
  ];

  // Reviews data
  const reviews = [
    { id: 1, name: "Priya Sharma", text: "Sarrika's guidance transformed my spiritual journey completely.", rating: 5, avatar: "🙏", date: "2 weeks ago" },
    { id: 2, name: "Rahul Verma", text: "The divine solutions provided immediate relief to my problems.", rating: 5, avatar: "😇", date: "1 month ago" },
    { id: 3, name: "Anjali Patel", text: "The courses are life-changing with practical spiritual wisdom.", rating: 4, avatar: "🌺", date: "3 months ago" },
    { id: 4, name: "Sanjay Gupta", text: "The energy healing session was incredibly powerful.", rating: 5, avatar: "🌟", date: "2 months ago" }
  ];

  useEffect(() => {
    // Get navbar height after it's rendered
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/getCourses`);
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        // Take first 6 courses or all if less than 6
        setCourses(data.slice(0, 6));
      } catch (err) {
        setCoursesError(err.message);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide/show navbar
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setNavbarVisible(false);
      } else {
        // Scrolling up
        setNavbarVisible(true);
      }
      
      // Navbar background change
      if (currentScrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Auto-rotate banners
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  
  return (
    <div className="home-page">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      {/* Optimized Banner Section */}
      
      <div 
        className="hero-banner" 
        style={{ 
          marginTop: `${navbarHeight}px`,
          height: `calc(50vh - ${navbarHeight}px)`
        }}
      >
        {banners.map((banner, index) => (
          <div 
            key={index}
            className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${banner.image})` }}
            aria-hidden={index !== currentSlide}
          />
        ))}
      </div>

      {/* About Section */}
      <section className="about-section py-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
              <div className="about-image position-relative">
                <img 
                  src="/divine-about.jpg" 
                  alt="About Sarrika's Divine Solution" 
                  className="img-fluid rounded-4 shadow-lg"
                />
                <div className="position-absolute top-0 start-0 w-100 h-100 border border-4 border-white rounded-4"></div>
                <div className="floating-badge bg-primary text-white shadow">
                  <span className="h4 mb-0">15+</span>
                  <small>Years Experience</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="ps-lg-5">
                <h2 className="display-5 fw-bold mb-4">
                  <span className="text-primary me-3">🌌</span>
                  About Sarrika's Divine Solution
                </h2>
                <p className="lead mb-4">
                  Sarrika's Divine Solution is a sacred space where ancient spiritual wisdom meets modern 
                  life challenges. Our divine solutions are rooted in 5000 years of Vedic knowledge, 
                  tailored to bring peace, prosperity, and enlightenment to your life.
                </p>
                <div className="row g-4">
                  <div className="col-md-4">
                    <div className="stat-card text-center p-3 rounded-3 shadow-sm">
                      <div className="stat-icon display-4 mb-3">🙏</div>
                      <h3 className="h1 mb-2">5000+</h3>
                      <p className="mb-0 text-muted">Souls Transformed</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card text-center p-3 rounded-3 shadow-sm">
                      <div className="stat-icon display-4 mb-3">🕉️</div>
                      <h3 className="h1 mb-2">50+</h3>
                      <p className="mb-0 text-muted">Sacred Practices</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card text-center p-3 rounded-3 shadow-sm">
                      <div className="stat-icon display-4 mb-3">✨</div>
                      <h3 className="h1 mb-2">15+</h3>
                      <p className="mb-0 text-muted">Years of Service</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <button className="btn btn-outline-primary btn-lg me-3">Learn More</button>
                  <button className="btn btn-primary btn-lg">Watch Video</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
        <section className="courses-section py-7 bg-light">
        <div className="container">
          <div className="text-center mb-6" data-aos="fade-up">
            <h2 className="display-5 fw-bold mb-3">
              <span className="text-primary me-3">📿</span>
              Our Divine Courses
            </h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: "600px"}}>
              Embark on your spiritual journey with our sacred courses designed for all levels
            </p>
          </div>
          
          {loadingCourses ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading divine courses...</p>
            </div>
          ) : coursesError ? (
            <div className="alert alert-danger text-center">
              Error loading courses: {coursesError}
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course, index) => (
                <div 
                  key={course.id} 
                  className="col-md-6 col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="course-card h-100">
                    <div className="course-image">
                        <img 
                          src={`${config.API_BASE_URL}/uploads/CourseLogo/${course.logoUrl}`} 
                          alt={course.title}
                          className="img-fluid"
                        />
                      </div>
                    <h3 className="h4 mb-3">{course.title}</h3>
                    <div className="course-meta d-flex justify-content-between mb-4">
                      <span className="badge bg-primary bg-opacity-10 text-primary">
                        ⏳ {course.duration || 'Self-paced'}
                      </span>
                      <span className="badge bg-success bg-opacity-10 text-success">
                        🧭 {course.level || 'All Levels'}
                      </span>
                    </div>
                    <p className="text-muted mb-4">
                      {course.description || 'Transform your spiritual path with this sacred knowledge.'}
                    </p>
                    <button className="btn btn-primary w-100 mt-auto">
                      Enroll Now <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-5" data-aos="fade-up">
            <Link to="/courses" className="btn btn-outline-primary btn-lg">
              Explore All Courses <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section py-7">
        <div className="container">
          <div className="text-center mb-6" data-aos="fade-up">
            <h2 className="display-5 fw-bold mb-3">
              <span className="text-primary me-3">🌟</span>
              Divine Experiences
            </h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: "600px"}}>
              What seekers say about their spiritual transformation
            </p>
          </div>
          
          <div className="row g-4">
            {reviews.map((review, index) => (
              <div key={review.id} className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="review-card h-100">
                  <div className="review-avatar display-4 mb-3">{review.avatar}</div>
                  <div className="rating mb-3 text-warning">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <blockquote className="mb-4">
                    <p className="mb-0">"{review.text}"</p>
                  </blockquote>
                  <div className="review-author mt-auto">
                    <h5 className="mb-1">{review.name}</h5>
                    <small className="text-muted">{review.date}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-7 bg-dark text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mb-4 mb-lg-0" data-aos="fade-right">
              <h2 className="display-5 fw-bold mb-3">Ready for Your Spiritual Transformation?</h2>
              <p className="lead mb-0">
                Begin your journey today with a personalized divine consultation
              </p>
            </div>
            <div className="col-lg-4 text-lg-end" data-aos="fade-left">
              <button className="btn btn-light btn-lg px-5 py-3 me-3">Book Now</button>
              <button className="btn btn-outline-light btn-lg px-5 py-3">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section py-7">
        <div className="container">
          <div className="text-center mb-6" data-aos="fade-up">
            <h2 className="display-5 fw-bold mb-3">
              <span className="text-primary me-3">📍</span>
              Our Sacred Space
            </h2>
            <p className="lead text-muted mx-auto" style={{maxWidth: "600px"}}>
              Visit us for in-person divine consultations and healing
            </p>
          </div>
          
          <div className="ratio ratio-16x9 rounded-4 overflow-hidden shadow-lg" data-aos="fade-up">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.869174899922!2d77.20990531508158!3d28.57088898244072!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2a99b6f9fa7%3A0x83a25e55f0af4c82!2sAIIMS%20Delhi!5e0!3m2!1sen!2sin!4v1624458166788!5m2!1sen!2sin" 
              allowFullScreen="" 
              loading="lazy"
              title="Sacred Space Location"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
};

export default Home;  