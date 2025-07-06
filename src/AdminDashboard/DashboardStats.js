import React, { useState, useEffect } from 'react';
import config from '../config';
import styles from './DashboardStats.module.css';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/api/admin/dashboard-stats`);
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard stats...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!stats) return <div>No data available</div>;

  return (
    <div className={styles.dashboardStats}>
      <div className={styles.statsGrid}>
        {/* Total Stats Cards */}
        <div className={styles.statCard}>
          <h4>Total Users</h4>
          <div className={styles.statValue}>{stats.totalUsers}</div>
        </div>
        
        <div className={styles.statCard}>
          <h4>Course Purchases</h4>
          <div className={styles.statValue}>{stats.totalCoursePurchases}</div>
        </div>
        
        <div className={styles.statCard}>
          <h4>Consultation Bookings</h4>
          <div className={styles.statValue}>{stats.totalConsultationBookings}</div>
        </div>
        
        <div className={styles.statCard}>
          <h4>E-Report Purchases</h4>
          <div className={styles.statValue}>{stats.totalEReportPurchases}</div>
        </div>
      </div>

      {/* Revenue Section */}
      <div className={styles.section}>
        <h3>Revenue</h3>
        <div className={styles.revenueGrid}>
          <div className={styles.revenueCard}>
            <h4>Today</h4>
            <div className={styles.revenueValue}>₹{stats.revenueStats.today.toFixed(2)}</div>
          </div>
          <div className={styles.revenueCard}>
            <h4>Yesterday</h4>
            <div className={styles.revenueValue}>₹{stats.revenueStats.yesterday.toFixed(2)}</div>
          </div>
          <div className={styles.revenueCard}>
            <h4>This Week</h4>
            <div className={styles.revenueValue}>₹{stats.revenueStats.week.toFixed(2)}</div>
          </div>
          <div className={styles.revenueCard}>
            <h4>This Month</h4>
            <div className={styles.revenueValue}>₹{stats.revenueStats.month.toFixed(2)}</div>
          </div>
          <div className={styles.revenueCard}>
            <h4>This Year</h4>
            <div className={styles.revenueValue}>₹{stats.revenueStats.year.toFixed(2)}</div>
          </div>
          <div className={styles.revenueCard}>
            <h4>Total Revenue</h4>
            <div className={styles.revenueValue}>₹{stats.revenueStats.total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Time-based Stats */}
      <div className={styles.section}>
        <h3>Recent Activity</h3>
        <div className={styles.timeStatsGrid}>
          {Object.entries(stats.timeBasedStats).map(([period, counts]) => (
            <div key={period} className={styles.timeStatCard}>
              <h4>{period.charAt(0).toUpperCase() + period.slice(1)}</h4>
              <div className={styles.timeStatItem}>
                <span>Course Purchases:</span>
                <span>{counts.coursePurchases}</span>
              </div>
              <div className={styles.timeStatItem}>
                <span>Consultations:</span>
                <span>{counts.consultationBookings}</span>
              </div>
              <div className={styles.timeStatItem}>
                <span>E-Reports:</span>
                <span>{counts.eReportPurchases}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;