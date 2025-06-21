import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppToggle from './WhatsAppToggle';
import './Blog.css';

const Blog = () => {
  const [navbarScrolled, setNavbarScrolled] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');

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

  const blogPosts = [
    {
      id: 1,
      title: 'The Power of Your Life Path Number',
      excerpt: 'Discover how your core number influences your life journey and purpose...',
      category: 'numerology',
      date: 'May 15, 2023',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      title: 'Master Numbers 11, 22, and 33 Explained',
      excerpt: 'Understanding the significance and challenges of these powerful numbers...',
      category: 'numerology',
      date: 'April 28, 2023',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      title: 'Morning Meditation for Numerological Alignment',
      excerpt: 'A guided practice to harmonize with your personal numbers each day...',
      category: 'meditation',
      date: 'April 10, 2023',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      title: 'Numerology and Chakras: The Number-Energy Connection',
      excerpt: 'How your core numbers relate to your body\'s energy centers...',
      category: 'energy',
      date: 'March 22, 2023',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 5,
      title: 'The Spiritual Significance of Repeating Numbers',
      excerpt: 'Why you keep seeing 11:11, 333, and other number sequences...',
      category: 'spirituality',
      date: 'March 5, 2023',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 6,
      title: 'Calculating Your Personal Year Number',
      excerpt: 'How to determine and work with your current yearly vibration...',
      category: 'numerology',
      date: 'February 18, 2023',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1517971053567-8bde93bc6a58?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const filteredPosts = activeCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

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
              {filteredPosts.map(post => (
                <div key={post.id} className="col-md-6 col-lg-4">
                  <div className="blog-card">
                    <div className="blog-image">
                      <img src={post.image} alt={post.title} />
                      <span className="category-badge">{post.category}</span>
                    </div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="date">{post.date}</span>
                        <span className="read-time">{post.readTime}</span>
                      </div>
                      <h3>{post.title}</h3>
                      <p>{post.excerpt}</p>
                      <button className="btn btn-read-more">Read More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="featured-post py-5 bg-light">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <div className="featured-image">
                  <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Featured Post" />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="featured-content">
                  <span className="featured-badge">Featured Post</span>
                  <h2>The Numerology of 2024: A Universal 8 Year</h2>
                  <p className="featured-excerpt">
                    Discover what the universal year number 8 means for global energy and how it will affect your personal numerology chart in this comprehensive guide to the coming year's vibrations.
                  </p>
                  <div className="featured-meta">
                    <span className="date">June 1, 2023</span>
                    <span className="read-time">10 min read</span>
                  </div>
                  <button className="btn btn-featured">Read Full Article</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="newsletter py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2>Get Spiritual Insights Delivered</h2>
                <p className="mb-4">Subscribe to receive our latest numerology articles and spiritual guidance</p>
                <form className="newsletter-form">
                  <input type="email" placeholder="Your email address" />
                  <button type="submit" className="btn btn-subscribe">Subscribe</button>
                </form>
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

export default Blog;