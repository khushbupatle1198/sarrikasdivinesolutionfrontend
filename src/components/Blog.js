import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Blog.css';
import config from '../config';

const Blog = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/blogs`);
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

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

  const blogCategories = [
    { id: 'all', name: 'All Articles' },
    { id: 'numerology', name: 'Numerology' },
    { id: 'spirituality', name: 'Spirituality' },
    { id: 'meditation', name: 'Meditation' },
    { id: 'energy', name: 'Energy Healing' }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const handleReadMore = (post) => {
    setSelectedPost(post);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="blog-container">
      <Navbar navbarScrolled={navbarScrolled} navbarVisible={navbarVisible} />
      
      <div className="blog-page">
        <section className="blog-hero py-5">
          <div className="container text-center">
            <h1>Numerology & Spiritual Blog</h1>
            <p>Wisdom and insights to illuminate your path</p>
          </div>
        </section>

        <section className="blog-categories py-4 bg-light">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="category-tabs">
                  {blogCategories.map(category => (
                    <button
                      key={category.id}
                      className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="blog-posts py-5">
          <div className="container">
            <div className="row g-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <div key={post.id} className="col-md-6 col-lg-4">
                    <div className="blog-card">
                      <div className="blog-image">
                        <img 
                          src={post.imageUrl 
                            ? `${config.API_BASE_URL}/uploads/BlogImages/${post.imageUrl}` 
                            : 'https://via.placeholder.com/500x300'} 
                          alt={post.title} 
                        />
                        <span className="category-badge">{post.category}</span>
                      </div>
                      <div className="blog-content">
                        <div className="blog-meta">
                          <span className="date">
                            {new Date(post.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <h3>{post.title}</h3>
                        <p>{post.excerpt || post.content.substring(0, 100) + '...'}</p>
                        <button 
                          className="btn btn-read-more"
                          onClick={() => handleReadMore(post)}
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center">
                  <p>No blog posts found in this category.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {showModal && selectedPost && (
          <div className="blog-modal-overlay">
            <div className="blog-modal">
              <div className="blog-modal-header">
                <h3>{selectedPost.title}</h3>
                <button onClick={closeModal} className="close-modal-btn">
                  &times;
                </button>
              </div>
              <div className="blog-modal-body">
                <div className="blog-modal-meta">
                  <span className="author">By {selectedPost.author}</span>
                  <span className="date">
                    {new Date(selectedPost.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                {selectedPost.imageUrl && (
                  <img 
                    src={`${config.API_BASE_URL}/uploads/BlogImages/${selectedPost.imageUrl}`} 
                    alt={selectedPost.title} 
                    className="blog-modal-image"
                  />
                )}
                <div className="blog-modal-content">
                  {selectedPost.content}
                </div>
              </div>
              <div className="blog-modal-footer">
                <button onClick={closeModal} className="btn btn-close-modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppToggle />
    </div>
  );
};

export default Blog;