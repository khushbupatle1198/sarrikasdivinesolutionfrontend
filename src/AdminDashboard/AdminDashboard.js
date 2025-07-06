import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import CourseManagement from './CourseManagement';
import EReportManagement from './EReportManagement';
import ConsultationManagement from './ConsultationManagement';
import BannerManagement from './BannerManagement';
import BlogManagement from './BlogManagement';
import VideoManagement from './VideoManagement';
import AdminCoursePurchases from './AdminCoursePurchases';
import ConsultationBookings from './ConsultationBookings';
import EReportBookings from './EReportBookings';
import ReviewManagement from './ReviewManagement';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
   const navigate = useNavigate();
  
  const handleLogout = () => {
  // Clear user data from localStorage
  localStorage.removeItem('user');
  
  // Clear session storage (if used)
  sessionStorage.clear();
  
  // Redirect to login page with no history (replace instead of push)
  navigate('/login', { replace: true });
  
  // Optional: Force a hard reload to clear any cached data
  window.location.reload();
};

  return (
    <div className={styles.adminDashboard}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>Sacred Admin</h2>
          <p>Divine Solutions Portal</p>
        </div>
        
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="bi bi-speedometer2"></i> Dashboard
          </button>
          <button 
  className={`${styles.navItem} ${activeTab === 'users' ? styles.active : ''}`}
  onClick={() => setActiveTab('users')}
>
  <i className="bi bi-people"></i> User Management
</button>
          <button 
  className={`${styles.navItem} ${activeTab === 'purchases' ? styles.active : ''}`}
  onClick={() => setActiveTab('purchases')}
>
  <i className="bi bi-cart-check"></i> Course Purchases
</button>
          <button 
  className={`${styles.navItem} ${activeTab === 'banners' ? styles.active : ''}`}
  onClick={() => setActiveTab('banners')}
>
  <i className="bi bi-image"></i> Banner Management
</button>
          <button 
            className={`${styles.navItem} ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <i className="bi bi-book"></i> Add Courses
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'consultations' ? styles.active : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <i className="bi bi-chat"></i>Add Consultations
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'consultationsbooking' ? styles.active : ''}`}
            onClick={() => setActiveTab('consultationsbooking')}
          >
            <i className="bi bi-person-lines-fill"></i>Consultation Bookings
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'ereport' ? styles.active : ''}`}
            onClick={() => setActiveTab('ereport')}
          >
           <i className="bi bi-file-earmark-text"></i> Add E-Report
          </button>
          <button 
  className={`${styles.navItem} ${activeTab === 'ereportbookings' ? styles.active : ''}`}
  onClick={() => setActiveTab('ereportbookings')}
>
  <i className="bi bi-file-earmark-text"></i> E-Report Bookings
</button>
          <button 
             className={`${styles.navItem} ${activeTab === 'blogs' ? styles.active : ''}`}
             onClick={() =>setActiveTab('blogs')}
>
  <i className="bi bi-file-earmark-text"></i> Blog Management
</button>
          <button 
  className={`${styles.navItem} ${activeTab === 'videos' ? styles.active : ''}`}
  onClick={() => setActiveTab('videos')}
>
  <i className="bi bi-camera-video"></i> Video Management
</button>

          <button 
            className={`${styles.navItem} ${activeTab === 'review' ? styles.active : ''}`}
            onClick={() => setActiveTab('review')}
          ><i className="bi bi-star-fill me-2"></i>Review</button>
          
        </nav>
        
        <div className={styles.adminProfile}>
          <div className={styles.avatar}><img src="/logo.png" alt="Sarrika Logo" className="navbar-logo" /></div>
          <div className={styles.info}>
            <h4>Sarrika </h4>
            <p>Super Admin</p>
          </div>
           
        </div>
        <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.header}>
          <h3>
            {activeTab === 'dashboard' && 'Dashboard'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'courses' && 'Course Management'}
            {activeTab === 'consultations' && 'Consultations'}
            {activeTab === 'numerologists' && 'Numerologists'}
            {activeTab === 'content' && 'Content Management'}
            {activeTab === 'settings' && 'Settings'}
          </h3>
          
          <div className={styles.headerActions}>
            <div className={styles.searchBar}>
              <i className="bi bi-search"></i>
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className={styles.notificationBtn}>
              <i className="bi bi-bell"></i>
              <span className={styles.badge}>3</span>
            </button>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <div className={styles.content}>
        {activeTab === 'dashboard' && <DashboardStats />}
          {activeTab === 'users' && (
  <UserManagement />
)}
          
          {activeTab === 'purchases' && (
            <AdminCoursePurchases />)}
         

          {activeTab === 'banners' && (
            <BannerManagement />)}
          
          {activeTab === 'courses' && (
            <CourseManagement />
          )}
          
          {activeTab === 'consultations' && (
           <ConsultationManagement/>
          )}

          {activeTab === 'consultationsbooking' && (
           <ConsultationBookings/>
          )}

          {activeTab === 'ereport' && (
           <EReportManagement/>
          )}

          {activeTab === 'ereportbookings' && (
          <EReportBookings />
          )}

           {activeTab === 'blogs' && (
           <BlogManagement/>
          )}
          
          {activeTab === 'videos' && (
  <VideoManagement />
)}

          {activeTab === 'review' && (
          <ReviewManagement />
            )}

          
          
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;