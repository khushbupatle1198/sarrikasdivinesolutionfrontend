import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import styles from './UserDashboard.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('courses');
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCourseVideos, setCurrentCourseVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  // Hooks
  const navigate = useNavigate();


  // Fetch user data and courses on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          navigate('/login');
          return;
        }

        // Fetch user details
        const userRes = await fetch(`${config.API_BASE_URL}/api/auth/user`, {
          credentials: 'include'
        });
        if (!userRes.ok) throw new Error('Failed to fetch user data');
        const userData = await userRes.json();
        setUserData(userData);

        // Fetch user's approved courses
        const coursesRes = await fetch(`${config.API_BASE_URL}/api/user/courses`, {
          credentials: 'include'
        });
        if (!coursesRes.ok) throw new Error('Failed to fetch courses');
        const coursesData = await coursesRes.json();
        
        setEnrolledCourses(coursesData);

        // Fetch pending courses
        const pendingRes = await fetch(`${config.API_BASE_URL}/api/user/pending-courses`, {
          credentials: 'include'
        });
        if (pendingRes.ok) {
          const pendingData = await pendingRes.json();
          setPendingCourses(pendingData);
        }

      } catch (err) {
        toast.error('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch videos for a specific course
  const fetchCourseVideos = async (courseId) => {
    try {
      setLoading(true);
      
      // Get course details
      const courseRes = await fetch(`${config.API_BASE_URL}/api/courses/${courseId}`, {
        credentials: 'include'
      });
      
      if (!courseRes.ok) {
        if (courseRes.status === 403) {
          toast.error('You do not have access to this course');
          return;
        }
        throw new Error('Failed to fetch course details');
      }
      
      const courseData = await courseRes.json();
      setCurrentCourse(courseData);

      // Get videos for this course
      const videosRes = await fetch(`${config.API_BASE_URL}/api/course/${courseId}/videos`, {
        credentials: 'include'
      });
      
      if (!videosRes.ok) {
        if (videosRes.status === 403) {
          toast.error('You do not have access to these videos');
          return;
        }
        throw new Error('Failed to fetch videos');
      }
      
      const videos = await videosRes.json();
      setCurrentCourseVideos(videos);
      setActiveTab('courseVideos');
    } catch (err) {
      toast.error('Failed to load course content');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Logout failed');
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) { 
      toast.error('Logout failed');
      console.error(err);
    }
  };

  // Handle profile image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setLoading(true);
      const res = await fetch(`${config.API_BASE_URL}/api/user/profile/image`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to upload image');
      const data = await res.json();

      setUserData({ ...userData, profileImage: data.profileImage });
      toast.success('Profile image updated successfully');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      setLoading(true);
      const res = await fetch(`${config.API_BASE_URL}/api/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to update profile');
      const updatedData = await res.json();

      setUserData(updatedData);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Play selected video
  const playVideo = (video) => {
    setSelectedVideo(video);
    setActiveTab('video');
  };

  // Video Player Component
  const VideoPlayer = () => {
    const videoRef = useRef(null);
    const [videoSrc, setVideoSrc] = useState('');

    useEffect(() => {
      // Security measures
      const preventDefault = (e) => {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.controls = false;
          setTimeout(() => {
            videoRef.current.controls = true;
          }, 100);
        }
      };

      document.addEventListener('contextmenu', preventDefault);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key)) ||
            (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
        }
      });

      // Set video source
      if (selectedVideo) {
        setVideoSrc(`${config.API_BASE_URL}/api/stream-video/${selectedVideo.id}`);
      }

      return () => {
        document.removeEventListener('contextmenu', preventDefault);
        document.removeEventListener('keydown', preventDefault);
      };
    }, []);

    return (
      <div className={styles.videoPlayerContainer}>
        <div className={styles.videoHeader}>
          <h3>{currentCourse?.title} - {selectedVideo.title}</h3>
          <button 
            className={styles.backButton}
            onClick={() => setActiveTab('courseVideos')}
          >
            <i className="bi bi-arrow-left"></i> Back to Videos
          </button>
        </div>
        
        <div className={styles.videoWrapper}>
          <video
            ref={videoRef}
            controls
            controlsList="nodownload noremoteplayback"
            disablePictureInPicture
            className={styles.videoElement}
            key={videoSrc}
          >
            <source 
              src={videoSrc}
              type="video/mp4" 
            />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <div className={styles.videoDescription}>
          <h4>About This Video</h4>
          <p>{selectedVideo.description || 'No description available'}</p>
        </div>
      </div>
    );
  };

  // Loading state
  if (!userData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // Main render
  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.container}>
          <h2>Sacred Portal</h2>
          <p>Welcome back, {userData.fullName} 🙏</p>
        </div>
      </div>

      <div className={styles.container}>
        {/* Sidebar */}
        <div className={styles.sidebar}>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              {userData.profileImage ? (
                <img 
                  src={`${config.API_BASE_URL}/uploads/profile/${userData.profileImage}`} 
                  alt="Profile"
                />
              ) : (
                <span>🧘</span>
              )}
              <input 
                type="file" 
                id="profileImage" 
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <label htmlFor="profileImage" className={styles.uploadLabel}>
                <i className="bi bi-camera"></i>
              </label>
            </div>
            <h3>{userData.fullName}</h3>
            <p>{userData.email}</p>
            <button 
              className={styles.editProfileButton}
              onClick={() => setActiveTab('profile')}
            >
              Edit Profile
            </button>
          </div>

          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'courses' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <i className="bi bi-book"></i> My Courses
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'pending' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('pending')}
            >
              <i className="bi bi-hourglass"></i> Pending Requests
            </button>
            <button 
              className={`${styles.navItem} ${styles.logoutButton}`} 
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className={styles.mainContent}>
          <ToastContainer position="top-center" theme="colored" />
          
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div className={styles.coursesSection}>
              <h3>My Sacred Courses</h3>
              {loading ? (
                <div className={styles.loading}>Loading courses...</div>
              ) : enrolledCourses.length === 0 ? (
                <p className={styles.noCourses}>You haven't enrolled in any courses yet.</p>
              ) : (
                <div className={styles.courseGrid}>
                  {enrolledCourses.map(course => (
                    <div className={styles.courseCard} key={course.courseId}>
                      <div className={styles.courseThumbnail}>
                        <img 
                          src={`${config.API_BASE_URL}/uploads/CourseLogo/${course.logoUrl}`} 
                          alt={course.title}
                        />
                      </div>
                      <div className={styles.courseDetails}>
                        <h4>{course.title}</h4>
                        <p className={styles.price}>Price: ₹{course.price}</p>
                        <button 
                          className={styles.continueButton}
                          onClick={() => fetchCourseVideos(course.courseId)}
                        >
                          View Videos
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Course Videos Tab */}
          {activeTab === 'courseVideos' && (
            <div className={styles.videosSection}>
              <div className={styles.courseHeader}>
                <h3>{currentCourse?.title} Videos</h3>
                <button 
                  className={styles.backButton}
                  onClick={() => setActiveTab('courses')}
                >
                  <i className="bi bi-arrow-left"></i> Back to Courses
                </button>
              </div>
              
              {loading ? (
                <div className={styles.loading}>Loading videos...</div>
              ) : currentCourseVideos.length === 0 ? (
                <p className={styles.noVideos}>No videos available for this course yet.</p>
              ) : (
                <div className={styles.videoList}>
                  {currentCourseVideos.map((video, index) => (
                    <div 
                      key={video.id} 
                      className={styles.videoItem}
                      onClick={() => playVideo(video)}
                    >
                      <div className={styles.videoNumber}>{index + 1}</div>
                      <div className={styles.videoThumbnail}>
                        <i className="bi bi-play-circle"></i>
                      </div>
                      <div className={styles.videoInfo}>
                        <h4>{video.title}</h4>
                        <p className={styles.videoDuration}>{video.duration || '--:--'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Player */}
          {activeTab === 'video' && selectedVideo && <VideoPlayer />}

          {/* Pending Requests Tab */}
          {activeTab === 'pending' && (
        <div className={styles.pendingSection}>
          <h3>Your Course Requests</h3>
          {loading ? (
            <div className={styles.loading}>Loading requests...</div>
          ) : pendingCourses.length === 0 ? (
            <p className={styles.noPending}>No pending requests.</p>
          ) : (
            <div className={styles.pendingList}>
              {pendingCourses.map(course => (
                <div className={styles.pendingCard} key={course.id}>
                  <div className={styles.pendingThumbnail}>
                    <img 
                      src={`${config.API_BASE_URL}/uploads/CourseLogo/${course.logoUrl}`} 
                      alt={course.title}
                    />
                  </div>
                  <div className={styles.pendingDetails}>
                    <h4>{course.title}</h4>
                    <p>
                      Status: 
                      <span className={
                        course.status === 'APPROVED' ? styles.approvedStatus :
                        course.status === 'COMPLETED' ? styles.waitingStatus :
                        styles.pendingStatus
                      }>
                        {course.status === 'APPROVED' ? 'Approved ✅' :
                         course.status === 'COMPLETED' ? 'Waiting for Admin Approval ⏳' :
                         'Pending OTP Verification ❌'}
                      </span>
                    </p>
                    <p>Submitted on: {new Date(course.purchaseDate).toLocaleDateString()}</p>
                    {course.paymentProofPath && (
                      <a 
                        href={`${config.API_BASE_URL}/uploads/PaymentProofs/${course.paymentProofPath}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.proofLink}
                      >
                        View Payment Proof
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              <h3>Update Your Profile</h3>
              <form onSubmit={handleProfileUpdate} className={styles.profileForm}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    defaultValue={userData.fullName} 
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    defaultValue={userData.email} 
                    disabled
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    defaultValue={userData.phone} 
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    name="dob" 
                    defaultValue={userData.dob?.split('T')[0]} 
                  />
                </div>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;