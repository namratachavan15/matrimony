import React, { useEffect, useState } from "react";
import { api } from "../../Config/api";
import "./Dashboard.css";

// Matrimony-themed Icons as SVG components
const UsersIcon = () => (
  <svg className="stat-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const BrideIcon = () => (
  <svg className="stat-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 2a2 2 0 11.001 4.001A2 2 0 0112 4z"/>
    <path d="M12 6c-1.93 0-3.5 1.57-3.5 3.5S10.07 13 12 13s3.5-1.57 3.5-3.5S13.93 6 12 6z"/>
  </svg>
);

const GroomIcon = () => (
  <svg className="stat-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
    <rect x="11" y="2" width="2" height="5"/>
    <rect x="9" y="4" width="6" height="2"/>
  </svg>
);

const HeartIcon = () => (
  <svg className="stat-icon" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalGirls: 0,
    totalBoys: 0,
    totalStories: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const statCards = [
    {
      title: "Total Members",
      value: stats.totalUsers,
      icon: <UsersIcon />,
      colorClass: "stat-card-primary",
      description: "Registered members"
    },
    {
      title: "Brides",
      value: stats.totalGirls,
      icon: <BrideIcon />,
      colorClass: "stat-card-bride",
      description: "Female profiles"
    },
    {
      title: "Grooms",
      value: stats.totalBoys,
      icon: <GroomIcon />,
      colorClass: "stat-card-groom",
      description: "Male profiles"
    },
    {
      title: "Success Stories",
      value: stats.totalStories,
      icon: <HeartIcon />,
      colorClass: "stat-card-success",
      description: "Marriages arranged"
    }
  ];

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1><span className="matrimony-highlight">Matrimony</span> Dashboard</h1>
          <p className="dashboard-subtitle">Loading platform statistics...</p>
        </div>
        <div className="stats-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="stat-card skeleton">
              <div className="stat-icon-skeleton"></div>
              <div className="stat-content">
                <div className="stat-title-skeleton"></div>
                <div className="stat-value-skeleton"></div>
                <div className="stat-description-skeleton"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-main">
          <h1><span className="matrimony-highlight">Matrimony</span> Dashboard</h1>
          <p className="dashboard-subtitle">
            Real-time overview of platform members and success stories
          </p>
        </div>
        <button className="refresh-btn" onClick={fetchDashboardStats}>
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.colorClass}`}>
            <div className="stat-icon-wrapper">{stat.icon}</div>
            <div className="stat-content">
              <h3 className="stat-title">{stat.title}</h3>
              <p className="stat-value">{stat.value.toLocaleString()}</p>
              <p className="stat-description">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="analytics-section">
        {/* Gender Distribution Card */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h2>Gender Distribution</h2>
            <span className="analytics-subtitle">Percentage of brides and grooms</span>
          </div>
          <div className="gender-distribution">
            <div className="gender-item">
              <div className="gender-label">
                <span className="gender-dot bride-dot"></span>
                <span>Brides</span>
              </div>
              <div className="gender-bar-container">
                <div 
                  className="gender-bar bride-bar" 
                  style={{ width: `${calculatePercentage(stats.totalGirls, stats.totalUsers)}%` }}
                ></div>
              </div>
              <span className="gender-percent">
                {calculatePercentage(stats.totalGirls, stats.totalUsers)}%
              </span>
              <span className="gender-count">({stats.totalGirls.toLocaleString()})</span>
            </div>
            <div className="gender-item">
              <div className="gender-label">
                <span className="gender-dot groom-dot"></span>
                <span>Grooms</span>
              </div>
              <div className="gender-bar-container">
                <div 
                  className="gender-bar groom-bar" 
                  style={{ width: `${calculatePercentage(stats.totalBoys, stats.totalUsers)}%` }}
                ></div>
              </div>
              <span className="gender-percent">
                {calculatePercentage(stats.totalBoys, stats.totalUsers)}%
              </span>
              <span className="gender-count">({stats.totalBoys.toLocaleString()})</span>
            </div>
          </div>
        </div>

        {/* Success Rate Card */}
        <div className="analytics-card">
          <div className="analytics-header">
            <h2>Success Rate</h2>
            <span className="analytics-subtitle">Marriages per registered member</span>
          </div>
          <div className="success-rate">
            <div className="success-rate-value">
              {stats.totalUsers > 0 
                ? ((stats.totalStories / stats.totalUsers) * 100).toFixed(2)
                : "0.00"
              }%
            </div>
            <div className="success-rate-label">
              Success Rate
            </div>
            <div className="success-rate-details">
              <div className="success-rate-item">
                <span className="success-rate-number">{stats.totalStories.toLocaleString()}</span>
                <span className="success-rate-text">Successful Marriages</span>
              </div>
              <div className="success-rate-item">
                <span className="success-rate-number">{stats.totalUsers.toLocaleString()}</span>
                <span className="success-rate-text">Total Members</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Summary */}
      <div className="platform-summary">
        <div className="summary-content">
          <div className="summary-icon">
            <HeartIcon />
          </div>
          <div className="summary-text">
            <h3>Platform Summary</h3>
            <p>
              Currently serving {stats.totalUsers.toLocaleString()} members with {stats.totalStories.toLocaleString()} 
              successful marriages arranged. The platform maintains a healthy balance of {calculatePercentage(stats.totalGirls, stats.totalUsers)}% 
              brides and {calculatePercentage(stats.totalBoys, stats.totalUsers)}% grooms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;