import React, { useState, useMemo } from "react";
import { FaPlus, FaRedo, FaSearch } from "react-icons/fa";
import { useUserContext } from "../State/UserContext";

const ExpirePlanUser = () => {
  const { users, extendUserDate } = useUserContext();
  
  // State variables
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(null);
  const [expiryFilter, setExpiryFilter] = useState("all"); // ✅ NEW
  
  const itemsPerPage = 10;

  console.log("users",users);

  // --- calculateExpiryDate (must be declared before filterByExpiry)
  const calculateExpiryDate = (joiningDate) => {
    if (!joiningDate) return null;
  
    const joinDateObj = new Date(joiningDate);
    joinDateObj.setFullYear(joinDateObj.getFullYear() + 1); // ✅ 1 YEAR PLAN
  
    return joinDateObj;
  };

  const filterByExpiry = (usersList) => {
    const today = new Date();
    const weekEnd = new Date();
    weekEnd.setDate(today.getDate() + 7);

    const nextWeekStart = new Date();
    nextWeekStart.setDate(today.getDate() + 8);
    const nextWeekEnd = new Date();
    nextWeekEnd.setDate(today.getDate() + 14);

    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return usersList.filter((user) => {
      const expiry = calculateExpiryDate(user.jdate);
      if (!expiry) return false;

      switch (expiryFilter) {
        case "expired":
          return expiry < today;
        case "today":
          return expiry.toDateString() === today.toDateString();
        case "thisWeek":
          return expiry >= today && expiry <= weekEnd;
        case "nextWeek":
          return expiry >= nextWeekStart && expiry <= nextWeekEnd;
        case "thisMonth":
          return expiry >= today && expiry <= monthEnd;
        default:
          return true;
      }
    });
  };

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    let result = users || [];

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (user) =>
          (user.uname && user.uname.toLowerCase().includes(searchLower)) ||
          (user.umobile && user.umobile.includes(search)) ||
          (user.id && user.id.toString().includes(search)) ||
          (user.gender && user.gender.toLowerCase().includes(searchLower))
      );
    }

    return filterByExpiry(result);
  }, [users, search, expiryFilter]);

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

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const aVal =
        sortConfig.key === "expiry"
          ? calculateExpiryDate(a.jdate)
          : a[sortConfig.key];

      const bVal =
        sortConfig.key === "expiry"
          ? calculateExpiryDate(b.jdate)
          : b[sortConfig.key];

      // Handle undefined/null values gracefully
      const aDate = aVal ? new Date(aVal) : new Date(0);
      const bDate = bVal ? new Date(bVal) : new Date(0);

      return sortConfig.direction === "asc"
        ? aDate - bDate
        : bDate - aDate;
    });
  }, [filteredUsers, sortConfig]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / itemsPerPage));
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);

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

  // Handle extend with confirmation
  const handleExtend = (userId, username) => {
    setShowConfirmation({ userId, username });
  };

  const confirmExtend = async () => {
    if (!showConfirmation) return;
    
    setLoading(true);
    try {
      await extendUserDate(showConfirmation.userId);
      setShowConfirmation(null);
    } catch (error) {
      console.error("Error extending user:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearch("");
    setCurrentPage(1);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  
  return (
    <div className="container-fluid py-4 user-management-premium">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-calendar-x-fill me-2 text-primary"></i>
                Expired Plan Users
              </h2>

              <p className="text-muted mb-0">
                Manage users whose plans have expired or are about to expire
              </p>
            </div>
            
            <div className="text-muted">
              <i className="bi bi-people me-1"></i>
              {sortedUsers.length} users found
            </div>
          </div>

          {/* Main Card */}
          <div className="card shadow-lg border-0">
            {/* Card Header */}
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-clock-history me-2"></i>
                  Expired Users Management
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
                        placeholder="Search by name, mobile, profile ID or gender..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button 
                        className="btn btn-primary" 
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

                  {/* dropdown column kept where you placed it */}
                  <div className="col-md-4">
                    <select
                      className="form-select"
                      value={expiryFilter}
                      onChange={(e) => setExpiryFilter(e.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="expired">Expired</option>
                      <option value="today">Today</option>
                      <option value="thisWeek">This Week</option>
                      <option value="nextWeek">Next Week</option>
                      <option value="thisMonth">This Month</option>
                    </select>
                  </div>

                  <div className="col-md-4 d-flex align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Showing {currentUsers.length} of {sortedUsers.length} users
                    </small>
                  </div>
                </div>
              </form>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Processing request...</p>
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
                        <th>
                          <div className="d-flex align-items-center gap-1">
                            Expiry Date
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
                        <th style={{ width: '100px' }}>Extend</th>
                        <th style={{ width: '100px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-people-slash display-4 d-block mb-3 text-warning"></i>
                              {search ? 'No users found matching your search' : 'No expired users found'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((user) => {
                          const expiry = calculateExpiryDate(user.jdate);
                          return (
                            <tr key={user.id} className="hover-shadow">
                              <td>
                                <span className="badge bg-primary" style={{color:'white'}}>#{user.id}</span>
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
                                    {new Date(user.jdate).toLocaleDateString("en-GB", { timeZone: "UTC" })}

                                  </div>
                                ) : "-"}
                              </td>

                              <td>
                                {expiry ? (
                                  <div
                                    className={`fw-semibold ${
                                      expiry < new Date() ? 'text-danger' : 'text-success'
                                    }`}
                                  >
                                    <i className="bi bi-calendar-event me-2"></i>
                                    {expiry.toLocaleDateString("en-GB", { timeZone: "UTC" })}

                                  </div>
                                ) : "-"}
                              </td>

                              <td>
                                {user.extendDate ? (
                                  <div className={`fw-semibold ${new Date(user.extendDate) < new Date() ? 'text-danger' : 'text-success'}`}>
                                    <i className="bi bi-calendar-x me-2"></i>
                                    {user.extendDate}
                                  </div>
                                ) : "-"}
                              </td>
                              <td>
                                <button
                                  className="btn btn-outline-warning btn-sm"
                                  onClick={() => handleExtend(user.id, user.uname)}
                                  title="Extend user plan"
                                  disabled={loading}
                                >
                                  <FaPlus className="me-1" />
                                  Extend
                                </button>
                              </td>
                              <td>
                                {user.status == 1 ? (
                                  <span className="badge bg-success rounded-pill">
                                    <i className="bi bi-check-circle me-1"></i>
                                    Active
                                  </span>
                                ) : (
                                  <span className="badge bg-danger rounded-pill">
                                    <i className="bi bi-x-circle me-1"></i>
                                    Inactive
                                  </span>
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
                    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedUsers.length)} of {sortedUsers.length} entries
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
                    <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-people-fill fs-4"  style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{sortedUsers.length}</h5>
                      <p className="text-muted mb-0">Total Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-3">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-check-circle-fill fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {sortedUsers.filter(u => u.status == 1).length}
                      </h5>
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
                    <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-x-circle-fill fs-4"  style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {sortedUsers.filter(u => u.status != 1).length}
                      </h5>
                      <p className="text-muted mb-0">Inactive Users</p>
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
                      <i className="bi bi-gender-ambiguous fs-4"  style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {new Set(sortedUsers.map(u => u.gender)).size}
                      </h5>
                      <p className="text-muted mb-0">Genders</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-gradient-warning text-white">
                <h5 className="modal-title">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  Confirm Plan Extension
                </h5>
                <button 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowConfirmation(null)}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <div className="text-center py-3">
                  <i className="bi bi-calendar-plus display-4 text-warning d-block mb-3"></i>
                  <p className="lead">
                    Are you sure you want to extend the plan for <strong>{showConfirmation.username}</strong>?
                  </p>
                  <p className="text-muted small">
                    This will update the renewal date to today's date and activate the user if inactive.
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn btn-outline-secondary" 
                  onClick={() => setShowConfirmation(null)}
                  disabled={loading}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Cancel
                </button>
                <button 
                  className="btn btn-warning text-white" 
                  onClick={confirmExtend}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-1"></i>
                      Confirm Extension
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-shadow:hover {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          transition: box-shadow 0.2s ease;
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #c9a227 0%, #e0a800 100%);
        }
        .bg-pink {
          background-color: #5b1730 !important;
          color: white !important;
        }
        .avatar-container {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #dee2e6;
        }
        .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .form-select {
          border-radius: 0.375rem !important;
          padding: 0.375rem 2.25rem 0.375rem 0.75rem !important;
          background-color: #fff !important;
          border: 1px solid #ced4da !important;
          box-shadow: none !important;
        }
      
        .form-select:focus {
          border-color: #86b7fe !important;
          outline: 0 !important;
          box-shadow: 0 0 0 0.2rem rgba(13,110,253,.25) !important;
        }
      `}</style>
    </div>
  );
};

export default ExpirePlanUser;
