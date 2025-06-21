import React, { useState } from 'react';
import styles from './AdminDashboard.module.css';
import CourseManagement from './CourseManagement';
import EReportManagement from './EReportManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample data
  const stats = [
    { title: 'Total Users', value: '1,248', change: '+12%', trend: 'up' },
    { title: 'Active Courses', value: '24', change: '+3', trend: 'up' },
    { title: 'Consultations', value: '86', change: '-5%', trend: 'down' },
    { title: 'Revenue', value: '₹2,49,999', change: '+18%', trend: 'up' }
  ];

  const recentUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@sacred.com', joined: '2 days ago', status: 'active' },
    { id: 2, name: 'Rahul Verma', email: 'rahul@divine.com', joined: '1 week ago', status: 'active' },
    { id: 3, name: 'Anjali Patel', email: 'anjali@spiritual.com', joined: '2 weeks ago', status: 'inactive' },
    { id: 4, name: 'Sanjay Gupta', email: 'sanjay@vedic.com', joined: '3 weeks ago', status: 'active' },
    { id: 5, name: 'Meena Kumari', email: 'meena@yogic.com', joined: '1 month ago', status: 'active' }
  ];

  

  

  const numerologists = [
    { id: 1, name: 'Master Sarrika', specialty: 'Life Path & Destiny', consultations: 124, rating: 4.9 },
    { id: 2, name: 'Guru Nandini', specialty: 'Business Numerology', consultations: 87, rating: 4.8 },
    { id: 3, name: 'Pandit Ved', specialty: 'Vedic Numerology', consultations: 92, rating: 4.7 }
  ];

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
            <i className="bi bi-people"></i> Users
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'courses' ? styles.active : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <i className="bi bi-book"></i> Courses
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'consultations' ? styles.active : ''}`}
            onClick={() => setActiveTab('consultations')}
          >
            <i className="bi bi-chat"></i> Consultations
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'ereport' ? styles.active : ''}`}
            onClick={() => setActiveTab('ereport')}
          >
            <i className="bi bi-chat"></i> Add EReport
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'numerologists' ? styles.active : ''}`}
            onClick={() => setActiveTab('numerologists')}
          >
            <i className="bi bi-stars"></i> Numerologists
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'content' ? styles.active : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <i className="bi bi-file-earmark-text"></i> Content
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <i className="bi bi-gear"></i> Settings
          </button>
        </nav>
        
        <div className={styles.adminProfile}>
          <div className={styles.avatar}>A</div>
          <div className={styles.info}>
            <h4>Admin User</h4>
            <p>Super Admin</p>
          </div>
        </div>
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
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                  <div key={index} className={styles.statCard}>
                    <h4>{stat.title}</h4>
                    <div className={styles.statValue}>{stat.value}</div>
                    <div className={`${styles.statChange} ${stat.trend === 'up' ? styles.up : styles.down}`}>
                      {stat.change} <i className={`bi bi-arrow-${stat.trend}`}></i>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Recent Users */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h4>Recent Users</h4>
                  <button className={styles.viewAllBtn}>View All</button>
                </div>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Joined</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.joined}</td>
                          <td>
                            <span className={`${styles.status} ${user.status === 'active' ? styles.active : styles.inactive}`}>
                              {user.status}
                            </span>
                          </td>
                          <td>
                            <button className={styles.actionBtn}>
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className={styles.actionBtn}>
                              <i className="bi bi-pencil"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              
              
            </>
          )}
          
          {activeTab === 'users' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>All Users</h4>
                <div className={styles.headerActions}>
                  <button className={styles.primaryBtn}>
                    <i className="bi bi-plus"></i> Add User
                  </button>
                  <div className={styles.filterDropdown}>
                    <select>
                      <option>Filter by Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Joined</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.joined}</td>
                        <td>
                          <span className={`${styles.status} ${user.status === 'active' ? styles.active : styles.inactive}`}>
                            {user.status}
                          </span>
                        </td>
                        <td>
                          <button className={styles.actionBtn}>
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className={styles.actionBtn}>
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className={styles.actionBtn}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.pagination}>
                <button className={styles.pageBtn} disabled>Previous</button>
                <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <button className={styles.pageBtn}>Next</button>
              </div>
            </div>
          )}
          
          {activeTab === 'courses' && (
            <CourseManagement />
          )}
          
          

          {activeTab === 'ereport' && (
           <EReportManagement/>
          )}
          
          {activeTab === 'numerologists' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>Numerologists</h4>
                <button className={styles.primaryBtn}>
                  <i className="bi bi-plus"></i> Add Numerologist
                </button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Specialty</th>
                      <th>Consultations</th>
                      <th>Rating</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {numerologists.map(numerologist => (
                      <tr key={numerologist.id}>
                        <td>{numerologist.id}</td>
                        <td>{numerologist.name}</td>
                        <td>{numerologist.specialty}</td>
                        <td>{numerologist.consultations}</td>
                        <td>
                          <span className={styles.rating}>
                            {numerologist.rating} <i className="bi bi-star-fill"></i>
                          </span>
                        </td>
                        <td>
                          <span className={`${styles.status} ${styles.active}`}>
                            Active
                          </span>
                        </td>
                        <td>
                          <button className={styles.actionBtn}>
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className={styles.actionBtn}>
                            <i className="bi bi-pencil"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'content' && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h4>Blog Posts</h4>
                <button className={styles.primaryBtn}>
                  <i className="bi bi-plus"></i> Add Post
                </button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Author</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>The Power of Your Life Path Number</td>
                      <td>Numerology</td>
                      <td>Master Sarrika</td>
                      <td>May 15, 2023</td>
                      <td>
                        <span className={`${styles.status} ${styles.active}`}>
                          Published
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionBtn}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className={styles.actionBtn}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className={styles.actionBtn}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Master Numbers 11, 22, and 33 Explained</td>
                      <td>Numerology</td>
                      <td>Guru Nandini</td>
                      <td>April 28, 2023</td>
                      <td>
                        <span className={`${styles.status} ${styles.active}`}>
                          Published
                        </span>
                      </td>
                      <td>
                        <button className={styles.actionBtn}>
                          <i className="bi bi-eye"></i>
                        </button>
                        <button className={styles.actionBtn}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className={styles.actionBtn}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className={styles.settingsCard}>
              <h4>System Settings</h4>
              
              <div className={styles.settingsTabs}>
                <button className={`${styles.settingsTab} ${styles.active}`}>General</button>
                <button className={styles.settingsTab}>Payment</button>
                <button className={styles.settingsTab}>Email</button>
                <button className={styles.settingsTab}>Security</button>
              </div>
              
              <div className={styles.settingsForm}>
                <div className={styles.formGroup}>
                  <label>Site Title</label>
                  <input type="text" defaultValue="Sarrika's Divine Solution" />
                </div>
                
                <div className={styles.formGroup}>
                  <label>Site Logo</label>
                  <div className={styles.fileUpload}>
                    <input type="file" id="logoUpload" />
                    <label htmlFor="logoUpload">Choose File</label>
                    <span>No file chosen</span>
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Maintenance Mode</label>
                  <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                  </label>
                  <p className={styles.hint}>When enabled, only admins can access the site</p>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Default Timezone</label>
                  <select>
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                    <option>America/New_York</option>
                  </select>
                </div>
                
                <div className={styles.formActions}>
                  <button className={styles.saveBtn}>Save Changes</button>
                  <button className={styles.cancelBtn}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;