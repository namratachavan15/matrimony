import React, { useEffect, useState, useMemo } from "react";
import { useUserContext } from "../State/UserContext";

const DeactiveUsers = () => {
  const { users, fetchUsers, updateUserStatus } = useUserContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const usersPerPage = 10;

  // Load users
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        await fetchUsers();
      } catch (error) {
        setErrorMessage("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filter deactive users
  const deactiveUsers = useMemo(() => 
    users.filter(user => user.status === 0), 
    [users]
  );

  // Search and filter logic
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return deactiveUsers;
    
    const query = searchQuery.toLowerCase();
    return deactiveUsers.filter(user => 
      user.uname.toLowerCase().includes(query) ||
      user.umobile.includes(query) ||
      (user.id && user.id.toString().includes(query))
    );
  }, [deactiveUsers, searchQuery]);

  // Sorting
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
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  // Pagination
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  // Generate page numbers for pagination
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle activating user
  const handleActivateUser = async (userId) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      await updateUserStatus(userId, 1); // Change status to active (1)
      setSuccessMessage("User activated successfully!");
      
      // Clear messages after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (error) {
      setErrorMessage("Failed to activate user. Please try again.");
    } finally {
      setLoading(false);
      setSelectedUser(null);
    }
  };

  // Confirm activation modal
  const confirmActivation = (user) => {
    setSelectedUser(user);
  };

  const cancelActivation = () => {
    setSelectedUser(null);
  };

  return (
    <div className="container-fluid py-4 user-management-premium">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-people-fill me-2 text-danger"></i>
                Deactive Users
              </h2>
              <p className="text-muted mb-0">
                View and manage all deactive users in the system
              </p>
            </div>
            
            <div className="text-muted">
              <i className="bi bi-person-x me-1"></i>
              {sortedUsers.length} deactive users
            </div>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="alert alert-success alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {successMessage}
              <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
            </div>
          )}
          
          {errorMessage && (
            <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errorMessage}
              <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
            </div>
          )}

          {/* Main Card */}
          <div className="card shadow-lg border-0">
            {/* Card Header */}
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-person-x me-2"></i>
                  Deactive Users List
                </h4>
              </div>
            </div>

            {/* Search Bar */}
            <div className="card-body border-bottom">
              <form onSubmit={handleSearchSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name, mobile, or ID..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                      <button 
                        className="btn btn-primary" 
                        type="submit"
                      >
                        <i className="bi bi-search me-2"></i>
                        Search
                      </button>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex align-items-center">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Showing {currentUsers.length} of {sortedUsers.length} deactive users
                    </small>
                  </div>
                </div>
              </form>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-danger" role="status">
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
                            User Name
                            <i className={`bi ${getSortIcon('uname')} text-muted`}></i>
                          </div>
                        </th>
                        <th>Mobile No</th>
                        <th 
                          onClick={() => handleSort('gender')} 
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            Gender
                            <i className={`bi ${getSortIcon('gender')} text-muted`}></i>
                          </div>
                        </th>
                        <th style={{ width: '120px' }}>Status</th>
                       
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-person-x display-4 d-block mb-3 text-danger"></i>
                              {searchQuery ? 'No deactive users found matching your search' : 'No deactive users found'}
                              {searchQuery && (
                                <button 
                                  className="btn btn-outline-danger btn-sm mt-2"
                                  onClick={() => setSearchQuery("")}
                                >
                                  Clear search
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((user) => (
                          <tr key={user.id} className="hover-shadow">
                            <td>
                            <span className="badge bg-primary" style={{color:'white'}}>#{user.id}</span>
                            </td>
                            <td>
                              <div className="fw-semibold">{user.uname}</div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-telephone text-muted me-2"></i>
                                {user.umobile}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${user.gender === 'Male' ? 'bg-info' : 'bg-pink'}`} style={{color:'white'}}>
                                <i className={`bi ${user.gender === 'Male' ? 'bi-gender-male' : 'bi-gender-female'} me-1`}></i>
                                {user.gender}
                              </span>
                            </td>
                            <td>
                              <span className="badge bg-danger rounded-pill py-2 px-3" style={{color:'white'}}>
                                <i className="bi bi-x-circle me-1"></i>
                                Deactive
                              </span>
                            </td>
                          
                          </tr>
                        ))
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
            <div className="col-md-4">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-people-fill fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{deactiveUsers.length}</h5>
                      <p className="text-muted mb-0">Total Deactive Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-person-x fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {deactiveUsers.filter(u => u.gender === 'Male').length}
                      </h5>
                      <p className="text-muted mb-0">Deactive Males</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-pink bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-person-x fs-4" style={{color: 'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {deactiveUsers.filter(u => u.gender === 'Female').length}
                      </h5>
                      <p className="text-muted mb-0">Deactive Females</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {selectedUser && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm Activation
                </h5>
                <button type="button" className="btn-close" onClick={cancelActivation}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to activate user <strong>{selectedUser.uname}</strong>?</p>
                <div className="alert alert-info mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  This will change their status to active and they will appear in the active users list.
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelActivation}>
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={() => handleActivateUser(selectedUser.id)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Activating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Yes, Activate User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeactiveUsers;