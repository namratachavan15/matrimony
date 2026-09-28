import React, { useState, useEffect, useMemo } from "react";
import { FaRedo, FaSearch, FaCalendarCheck } from "react-icons/fa";
import { useUserContext } from "../State/UserContext";
import "./ReNewPlanUsers.css";

const ReNewPlanUsers = () => {
  const { users } = useUserContext();
  
  // State variables
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(false);
  
  const itemsPerPage = 5;

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!search) return users || [];
    
    const searchLower = search.toLowerCase();
    return users.filter(user => 
      (user.uname && user.uname.toLowerCase().includes(searchLower)) ||
      (user.umobile && user.umobile.includes(search)) ||
      (user.id && user.id.toString().includes(search)) ||
      (user.gender && user.gender.toLowerCase().includes(searchLower))
    );
  }, [users, search]);

  // Sorting functionality
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Sort users
  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;
    
    return [...filteredUsers].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      // Handle dates specially
      if (sortConfig.key === 'jdate' || sortConfig.key === 'extendDate') {
        const dateA = aVal ? new Date(aVal) : new Date(0);
        const dateB = bVal ? new Date(bVal) : new Date(0);
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      
      // Handle numeric values
      if (sortConfig.key === 'id') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      // Handle string values
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      
      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  // Get active users only
  const activeUsers = useMemo(() => {
    return sortedUsers.filter(user => user.status == 1);
  }, [sortedUsers]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(activeUsers.length / itemsPerPage));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = activeUsers.slice(indexOfFirst, indexOfLast);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
    }
    
    return pages;
  };

  const resetSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Format date
const formatDate = (dateString) => {
  if (!dateString || dateString === "0000-00-00") return "0000-00-00";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Calculate days until renewal
const getDaysUntilRenewal = (extendDate) => {
  if (!extendDate || extendDate === "0000-00-00") return null; // treat as invalid
  const today = new Date();
  const renewDate = new Date(extendDate);
  const diffTime = renewDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};


  return (
    <div className="container-fluid py-4 user-management-premium">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-calendar-check-fill me-2 text-primary"></i>
                Renew Plan Users
              </h2>
              <p className="text-muted mb-0">
                View and manage active users with their renewal dates
              </p>
            </div>
            
            <div className="text-muted">
              <i className="bi bi-people-fill me-1"></i>
              {activeUsers.length} active users
            </div>
          </div>

          {/* Main Card */}
          <div className="card shadow-lg border-0">
            {/* Card Header */}
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <FaCalendarCheck className="me-2" />
                  Active Users Management
                </h4>
              </div>
            </div>

            {/* Search Bar */}
            <div className="card-body border-bottom">
              <form onSubmit={handleSearchSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search active users by name, mobile, ID or gender..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button 
                        className="btn btn-primary text-white" 
                        type="submit"
                      >
                        <FaSearch className="me-2" />
                        Search
                      </button>
                      {search && (
                        <button 
                          className="btn btn-outline-secondary" 
                          type="button"
                          onClick={resetSearch}
                        >
                          <FaRedo />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="col-md-4 d-flex align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Showing {currentUsers.length} of {activeUsers.length} active users
                    </small>
                  </div>
                </div>
              </form>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading users...</p>
              </div>
            )}

            {/* Users Table */}
            {!loading && (
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th 
                          onClick={() => handleSort('id')} 
                          style={{ cursor: 'pointer', width: '80px' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            ID
                            <i className={`bi ${getSortIcon('id')} text-muted`}></i>
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('uname')} 
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            Username
                            <i className={`bi ${getSortIcon('uname')} text-muted`}></i>
                          </div>
                        </th>
                        <th>Mobile No</th>
                        <th>Gender</th>
                        <th 
                          onClick={() => handleSort('jdate')} 
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            Joining Date
                            <i className={`bi ${getSortIcon('jdate')} text-muted`}></i>
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('extendDate')} 
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            Renew Date
                            <i className={`bi ${getSortIcon('extendDate')} text-muted`}></i>
                          </div>
                        </th>
                        <th style={{ width: '120px' }}>Status</th>
                        <th style={{ width: '100px' }}>Days Left</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-people-slash display-4 d-block mb-3 text-muted"></i>
                              {search ? 'No active users found matching your search' : 'No active users found'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((user) => {
                          const daysLeft = getDaysUntilRenewal(user.extendDate);
                          const isExpiringSoon = daysLeft !== null && daysLeft <= 7;
                          const isExpired = daysLeft !== null && daysLeft < 0;
                          
                          return (
                            <tr key={user.id} className="hover-shadow">
                              <td>
                                <span className="badge bg-success" style={{color:'white'}}>#{user.id}</span>
                              </td>
                              <td>
                                <div className="fw-semibold">
                                  <i className="bi bi-person-circle me-2"></i>
                                  {user.uname || "N/A"}
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <i className="bi bi-telephone text-muted me-2"></i>
                                  {user.umobile || "N/A"}
                                </div>
                              </td>
                              <td>
                                <span className={`badge ${user.gender === 'Male' ? 'bg-info' : user.gender === 'Female' ? 'bg-pink' : 'bg-secondary'}`}>
                                  {user.gender || "N/A"}
                                </span>
                              </td>
                              <td>
                                {user.jdate ? (
                                  <div className="text-muted">
                                    <i className="bi bi-calendar-check me-2"></i>
                                    {formatDate(user.jdate)}
                                  </div>
                                ) : "-"}
                              </td>
                              <td>
  {user.extendDate === "0000-00-00" ? (
    <span className="text-muted">0000-00-00</span>
  ) : (
    <div className={`fw-semibold ${isExpired ? 'text-danger' : isExpiringSoon ? 'text-warning' : 'text-success'}`}>
      <i className={`bi ${isExpired ? 'bi-calendar-x' : 'bi-calendar-check'} me-2`}></i>
      {formatDate(user.extendDate)}
    </div>
  )}
</td>

                              <td>
                                <span className="badge bg-success rounded-pill">
                                  <i className="bi bi-check-circle me-1"></i>
                                  Active
                                </span>
                              </td>
                              <td>
                                {daysLeft !== null ? (
                                  <span className={`badge ${isExpired ? 'bg-danger' : isExpiringSoon ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                                    {isExpired ? 'Expired' : `${daysLeft} days`}
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary rounded-pill">N/A</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="text-muted small">
                    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, activeUsers.length)} of {activeUsers.length} entries
                  </div>
                  
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      {/* First Page */}
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(1)}
                          disabled={currentPage === 1}
                        >
                          <i className="bi bi-chevron-double-left"></i>
                        </button>
                      </li>
                      
                      {/* Previous Page */}
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => prev - 1)}
                          disabled={currentPage === 1}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      
                      {/* Page Numbers */}
                      {getPageNumbers().map(pageNum => (
                        <li 
                          key={pageNum} 
                          className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      ))}
                      
                      {/* Next Page */}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(prev => prev + 1)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                      
                      {/* Last Page */}
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={currentPage === totalPages}
                        >
                          <i className="bi bi-chevron-double-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            )}
          </div>

          {/* Stats Summary */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-people-fill fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{activeUsers.length}</h5>
                      <p className="text-muted mb-0">Active Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-calendar-check fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {activeUsers.filter(u => {
                          const days = getDaysUntilRenewal(u.extendDate);
                          return days !== null && days > 7;
                        }).length}
                      </h5>
                      <p className="text-muted mb-0">Valid Plans</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-exclamation-triangle fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {activeUsers.filter(u => {
                          const days = getDaysUntilRenewal(u.extendDate);
                          return days !== null && days <= 7 && days >= 0;
                        }).length}
                      </h5>
                      <p className="text-muted mb-0">Expiring Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-calendar-x fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {activeUsers.filter(u => {
                          const days = getDaysUntilRenewal(u.extendDate);
                          return days !== null && days < 0;
                        }).length}
                      </h5>
                      <p className="text-muted mb-0">Expired Plans</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReNewPlanUsers;