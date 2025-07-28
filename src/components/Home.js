import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
axios.post(`${config.API_BASE_URL}/api/savecourse`, data)

import './Home.css';

const Home = () => {
  // Existing state variables
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [bannersError, setBannersError] = useState(null);
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [coursesError, setCoursesError] = useState(null);
  
  // New state for reviews
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 0,
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const navigate = useNavigate();

  // Existing functions
  const handleRedirect = () => {
    navigate('/consultation');
  };

  // Fetch reviews from backend
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const response = await fetch(`${config.API_BASE_URL}/api/reviews`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!reviewForm.name.trim()) {
      return 'Name is required';
    }
    if (!reviewForm.email.trim()) {
      return 'Email is required';
    }
    if (!/^\S+@\S+\.\S+$/.test(reviewForm.email)) {
      return 'Please enter a valid email';
    }
    if (reviewForm.rating === 0) {
      return 'Please select a rating';
    }
    if (!reviewForm.message.trim()) {
      return 'Review message is required';
    }
    return null;
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitStatus({ 
        loading: false, 
        success: false, 
        error: validationError 
      });
      return;
    }

    setSubmitStatus({ loading: true, success: false, error: null });

    try {
      const response = await fetch(`${config.API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewForm),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      await response.json();
      
      // Reset form on success
      setReviewForm({
        name: '',
        email: '',
        rating: 0,
        message: ''
      });
      
      setSubmitStatus({ loading: false, success: true, error: null });
      
      // Refresh the reviews list
      fetchReviews();
      
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        success: false, 
        error: error.message || 'Failed to submit review'
      });
    }
  };

  // Existing useEffect hooks
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/banners`);
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        setBanners(data);
      } catch (err) {
        setBannersError(err.message);
        setBanners([]);
      } finally {
        setLoadingBanners(false);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
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
        setCourses(data.slice(0, 6));
      } catch (err) {
        setCoursesError(err.message);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      
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

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews();
  }, []);

useEffect(() => {
  if (reviews.length === 0) return;

  const sliderTrack = document.querySelector('.testimonials-slider-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  
  let currentIndex = 0;
  const slideWidth = slides[0].offsetWidth + 30; // Include gap
  
  // Create pagination dots
  const paginationContainer = document.querySelector('.slider-pagination');
  if (paginationContainer) {
    paginationContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      paginationContainer.appendChild(dot);
    });
  }
  
  // Update active dot
  const updatePagination = (index) => {
    document.querySelectorAll('.slider-pagination .dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  };
  
  // Go to specific slide
  const goToSlide = (index) => {
    currentIndex = index;
    sliderTrack.scrollTo({
      left: index * slideWidth,
      behavior: 'smooth'
    });
    updatePagination(index);
  };
  
  // Next slide
  const nextSlide = () => {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  };
  
  // Previous slide
  const prevSlide = () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
  };
  
  // Auto slide
  let autoSlide = setInterval(nextSlide, 5000);
  
  
  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  
  // Pause on hover
  sliderTrack.addEventListener('mouseenter', () => clearInterval(autoSlide));
  sliderTrack.addEventListener('mouseleave', () => autoSlide = setInterval(nextSlide, 5000));
  
  return () => {
    clearInterval(autoSlide);
    if (nextBtn) nextBtn.removeEventListener('click', nextSlide);
    if (prevBtn) prevBtn.removeEventListener('click', prevSlide);
  };
}, [reviews]);
  
  return (
    <div className="home-page">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      {/* Optimized Banner Section */}
      
      {loadingBanners ? (
        <div 
          className="banner-loading" 
          style={{ 
            marginTop: `${navbarHeight}px`,
            height: `calc(50vh - ${navbarHeight}px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading banners...</span>
          </div>
        </div>
      ) : bannersError ? (
        <div 
          className="banner-error" 
          style={{ 
            marginTop: `${navbarHeight}px`,
            height: `calc(50vh - ${navbarHeight}px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div className="alert alert-warning">
            Could not load banners: {bannersError}
          </div>
        </div>
      ) : banners.length > 0 ? (
        <div 
          className="hero-banner" 
          style={{ 
            marginTop: `${navbarHeight}px`,
            height: `calc(50vh - ${navbarHeight}px)`
          }}
        >
          {banners.map((banner, index) => (
            <div 
              key={banner.id || index}
              className={`banner-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ 
                backgroundImage: `url(${
                  banner.imageUrl 
                    ? `${config.API_BASE_URL}/uploads/BannerImages/${banner.imageUrl}`
                    : banner.image
                })` 
              }}
              aria-hidden={index !== currentSlide}
            />
          ))}
        </div>
      ) : (
        <div 
          className="no-banners" 
          style={{ 
            marginTop: `${navbarHeight}px`,
            height: `calc(50vh - ${navbarHeight}px)`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
          }}
        >
          <div className="alert alert-info">No banners available</div>
        </div>
      )}

      {/* About Section */}
      <section className="about-section py-7">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right">
              <div className="about-image position-relative">
                <img 
                  src="/Sarrikas.jpg" 
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
  At Sarrika's Divine Solution, we blend 5000 years of Vedic wisdom with practical spiritual tools - from <strong>Kundli Analysis</strong> and <strong>Vedic Numerology</strong> to <strong>Tarot Readings</strong> and <strong>Crystal Healing</strong>. Our unique services like <strong>Lo Shu Grid</strong> applications and <strong>Switch Words</strong> therapy offer tailored paths to enlightenment, while our <strong>Remedies Expertise</strong> provides gemstone/mantra solutions for modern life challenges.
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

      
      {/* Updated Testimonials Section */}
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
    
    {loadingReviews ? (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    ) : reviews.length === 0 ? (
      <div className="text-center py-5">
        <p>No reviews yet. Be the first to share your experience!</p>
      </div>
    ) : (
      <div className="testimonials-slider-container position-relative">
        <div className="testimonials-slider-track">
          {reviews.map((review) => (
            <div key={review.id} className="testimonial-slide">
              <div className="review-card h-100 p-4 bg-white rounded-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="review-author">
                    <h5 className="mb-1 fw-bold">{review.name}</h5>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </small>
                  </div>
                  <div className="rating text-warning">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="mb-0 fst-italic">"{review.message}"</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation Buttons */}
        <button className="slider-nav-btn prev-btn" aria-label="Previous testimonial">
          <i className="bi bi-chevron-left"></i>
        </button>
        <button className="slider-nav-btn next-btn" aria-label="Next testimonial">
          <i className="bi bi-chevron-right"></i>
        </button>
        
        {/* Pagination Dots */}
        <div className="slider-pagination"></div>
      </div>
    )}
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
             <button 
      className="btn btn-light btn-lg px-5 py-3 me-3"
      onClick={handleRedirect}
    >
      Book Now
    </button>
              
            </div>
          </div>
        </div>
      </section>

            {/* Review Form Section */}
      <section className="review-form-section py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">
                  <span className="text-primary me-2">✍️</span>
                  Share Your Experience
                </h2>
                <p className="lead text-muted">
                  We value your feedback about your spiritual journey with us
                </p>
              </div>
              
              <div className="card border-0 shadow-lg">
                <div className="card-body p-5">
                  <form onSubmit={handleReviewSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            type="text" 
                            className="form-control" 
                            id="name" 
                            placeholder="Your Name"
                            value={reviewForm.name}
                            onChange={(e) => setReviewForm({...reviewForm, name: e.target.value})}
                            required
                          />
                          <label htmlFor="name">Your Name</label>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="Email Address"
                            value={reviewForm.email}
                            onChange={(e) => setReviewForm({...reviewForm, email: e.target.value})}
                            required
                          />
                          <label htmlFor="email">Email Address</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="my-4">
                      <label className="form-label mb-3">Your Rating</label>
                      <div className="rating-input d-flex justify-content-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`rating-star btn btn-link ${star <= reviewForm.rating ? 'text-warning' : 'text-muted'}`}
                            onClick={() => setReviewForm({...reviewForm, rating: star})}
                          >
                            <i className="bi bi-star-fill fs-2"></i>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="form-floating">
                        <textarea 
                          className="form-control" 
                          id="message" 
                          placeholder="Your Experience"
                          style={{height: '120px'}}
                          value={reviewForm.message}
                          onChange={(e) => setReviewForm({...reviewForm, message: e.target.value})}
                          required
                        ></textarea>
                        <label htmlFor="message">Your Experience</label>
                      </div>
                    </div>
                    
                    <div className="d-grid">
                      <button 
                        type="submit" 
                        className="btn btn-primary btn-lg py-3"
                        disabled={submitStatus.loading}
                      >
                        {submitStatus.loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i> Submit Review
                          </>
                        )}
                      </button>
                    </div>

                    {/* Status messages */}
                    {submitStatus.success && (
                      <div className="alert alert-success mt-3 mb-0">
                        Thank you for your review!
                      </div>
                    )}
                    
                    {submitStatus.error && (
                      <div className="alert alert-danger mt-3 mb-0">
                        {submitStatus.error}
                      </div>
                    )}
                  </form>
                </div>
              </div>
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
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.701418818602!2d79.1495451!3d21.1244668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4b978d7046635%3A0x9ff7f6cb78764aad!2sSarika%20Shrirao!5e0!3m2!1sen!2sin!4v1750582133980!5m2!1sen!2sin" 
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
