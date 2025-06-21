import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserDashboard.module.css';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [userData, ] = useState({
    name: 'Divine Seeker',
    email: 'seeker@sacredpath.com',
    joinDate: 'January 15, 2023',
    profileComplete: 75,
    subscription: 'Premium'
  });
  const [enrolledCourses, ] = useState([
    {
      id: 1,
      title: 'Sacred Numerology Basics',
      progress: 65,
      lastAccessed: '2 days ago',
      thumbnail: '/numerology-course.jpg',
      instructor: 'Master Sarrika'
    },
    {
      id: 2,
      title: 'Advanced Chakra Healing',
      progress: 30,
      lastAccessed: '1 week ago',
      thumbnail: '/chakra-course.jpg',
      instructor: 'Guru Nandini'
    },
    {
      id: 3,
      title: 'Vedic Astrology Fundamentals',
      progress: 15,
      lastAccessed: '3 weeks ago',
      thumbnail: '/astrology-course.jpg',
      instructor: 'Pandit Ved'
    }
  ]);
  const [upcomingEvents, ] = useState([
    {
      id: 1,
      title: 'Full Moon Meditation',
      date: 'May 23, 2023',
      time: '7:00 PM',
      duration: '90 mins'
    },
    {
      id: 2,
      title: 'Personal Numerology Reading',
      date: 'May 28, 2023',
      time: '10:00 AM',
      duration: '60 mins'
    }
  ]);
  

  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate('/');
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.container}>
          <h2>Sacred Portal</h2>
          <p>Welcome back, {userData.name} 🙏</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.profile}>
            <div className={styles.avatar}>
              <span>🧘</span>
            </div>
            <h3>{userData.name}</h3>
            <p>{userData.email}</p>
            <div className={styles.profileCompletion}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: `${userData.profileComplete}%` }}
                ></div>
              </div>
              <span>{userData.profileComplete}% complete</span>
            </div>
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
              className={`${styles.navItem} ${activeTab === 'events' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <i className="bi bi-calendar"></i> Upcoming Events
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'consultations' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('consultations')}
            >
              <i className="bi bi-chat"></i> Consultations
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="bi bi-person"></i> Profile
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'settings' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <i className="bi bi-gear"></i> Settings
            </button>
            <button className={`${styles.navItem} ${styles.logoutButton}`} onClick={handleLogout}>
              <i className="bi bi-box-arrow-right"></i> Logout
            </button>
          </nav>
        </div>

        <div className={styles.mainContent}>
          {activeTab === 'courses' && (
            <div className={styles.coursesSection}>
              <h3>My Sacred Courses</h3>
              <div className={styles.courseGrid}>
                {enrolledCourses.map(course => (
                  <div className={styles.courseCard} key={course.id}>
                    <div className={styles.courseThumbnail}>
                      <img src={course.thumbnail} alt={course.title} />
                      <div className={styles.progressIndicator}>
                        <div 
                          className={styles.progressBar} 
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className={styles.courseDetails}>
                      <h4>{course.title}</h4>
                      <p className={styles.instructor}>By {course.instructor}</p>
                      <div className={styles.progressText}>
                        Progress: {course.progress}%
                      </div>
                      <p className={styles.lastAccessed}>
                        Last accessed: {course.lastAccessed}
                      </p>
                      <button className={styles.continueButton}>
                        Continue Learning
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className={styles.eventsSection}>
              <h3>Upcoming Sacred Events</h3>
              <div className={styles.eventsList}>
                {upcomingEvents.map(event => (
                  <div className={styles.eventCard} key={event.id}>
                    <div className={styles.eventDate}>
                      <div className={styles.date}>{event.date.split(' ')[1]}</div>
                      <div className={styles.month}>{event.date.split(' ')[0]}</div>
                    </div>
                    <div className={styles.eventDetails}>
                      <h4>{event.title}</h4>
                      <p>
                        <i className="bi bi-clock"></i> {event.time} • {event.duration}
                      </p>
                      <div className={styles.eventActions}>
                        <button className={styles.addCalendarButton}>
                          <i className="bi bi-calendar-plus"></i> Add to Calendar
                        </button>
                        <button className={styles.joinButton}>
                          Join Session
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className={styles.profileSection}>
              <h3>Sacred Profile</h3>
              <div className={styles.profileForm}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input type="text" defaultValue={userData.name} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" defaultValue={userData.email} disabled />
                </div>
                <div className={styles.formGroup}>
                  <label>Birth Date (For Numerology)</label>
                  <input type="date" />
                </div>
                <div className={styles.formGroup}>
                  <label>Life Path Number</label>
                  <input type="text" placeholder="Calculate automatically" />
                </div>
                <div className={styles.formGroup}>
                  <label>Spiritual Interests</label>
                  <div className={styles.interestsGrid}>
                    <label className={styles.interestOption}>
                      <input type="checkbox" /> Numerology
                    </label>
                    <label className={styles.interestOption}>
                      <input type="checkbox" /> Astrology
                    </label>
                    <label className={styles.interestOption}>
                      <input type="checkbox" /> Meditation
                    </label>
                    <label className={styles.interestOption}>
                      <input type="checkbox" /> Chakra Healing
                    </label>
                    <label className={styles.interestOption}>
                      <input type="checkbox" /> Tarot
                    </label>
                    <label className={styles.interestOption}>
                      <input type="checkbox" /> Vedic Sciences
                    </label>
                  </div>
                </div>
                <button className={styles.saveButton}>Save Changes</button>
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className={styles.consultationsSection}>
              <h3>Divine Consultations</h3>
              <div className={styles.consultationStatus}>
                <div className={`${styles.statusCard} ${styles.upcoming}`}>
                  <h4>Upcoming</h4>
                  <div className={styles.count}>2</div>
                </div>
                <div className={`${styles.statusCard} ${styles.completed}`}>
                  <h4>Completed</h4>
                  <div className={styles.count}>5</div>
                </div>
                <div className={`${styles.statusCard} ${styles.requested}`}>
                  <h4>Requested</h4>
                  <div className={styles.count}>1</div>
                </div>
              </div>
              
              <div className={styles.consultationList}>
                <h4>Upcoming Sessions</h4>
                <div className={styles.consultationCard}>
                  <div className={styles.consultationInfo}>
                    <div className={styles.expert}>
                      <div className={styles.expertAvatar}>🧙‍♀️</div>
                      <div className={styles.expertDetails}>
                        <h5>Master Sarrika</h5>
                        <p>Numerology Specialist</p>
                      </div>
                    </div>
                    <div className={styles.consultationTime}>
                      <p>May 28, 2023</p>
                      <p>10:00 AM - 11:00 AM</p>
                    </div>
                    <div className={styles.consultationType}>
                      <span>Personal Reading</span>
                    </div>
                  </div>
                  <div className={styles.consultationActions}>
                    <button className={styles.joinButton}>Join Session</button>
                    <button className={styles.btnReschedule}>Reschedule</button>
                  </div>
                </div>
              </div>
              
              <button className={styles.bookNewButton}>
                <i className="bi bi-plus-circle"></i> Book New Consultation
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles.settingsSection}>
              <h3>Account Settings</h3>
              <div className={styles.settingsTabs}>
                <button className={`${styles.settingsTab} ${styles.settingsTabActive}`}>Account</button>
                <button className={styles.settingsTab}>Notifications</button>
                <button className={styles.settingsTab}>Security</button>
                <button className={styles.settingsTab}>Subscription</button>
              </div>
              
              <div className={styles.settingsContent}>
                <div className={styles.formGroup}>
                  <label>Change Password</label>
                  <input type="password" placeholder="Current Password" />
                  <input type="password" placeholder="New Password" />
                  <input type="password" placeholder="Confirm New Password" />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Email Notifications</label>
                  <label className={styles.switch}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.slider}></span>
                  </label>
                  <p className={styles.hint}>Receive spiritual insights and updates</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Dark Mode</label>
                  <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </label>
                </div>
                
                <button className={styles.saveButton}>Save Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;