import React, { useEffect, useState, useMemo } from "react";
import { useUserContext } from "../State/UserContext";
import { useNavigate } from "react-router-dom";

const BioDataPage = () => {
  const { users, fetchUsers } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

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

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.uname.toLowerCase().includes(query) ||
        user.umobile.includes(query) ||
        (user.id && user.id.toString().includes(query))
    );
  }, [users, searchQuery]);

  // Sorting logic
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

  const handleView = (userId) => {
    navigate(`/biodata/${userId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

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

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-file-person-fill me-2 text-primary"></i>
                All Users BioData
              </h2>
              <p className="text-muted mb-0">
                View and access biodata for all registered users
              </p>
            </div>
            
            <div className="text-muted">
              <i className="bi bi-people me-1"></i>
              {sortedUsers.length} total users
            </div>
          </div>

          {/* Main Card */}
          <div className="card shadow-lg border-0">
            {/* Card Header */}
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-file-text me-2"></i>
                  Users List
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
                      Showing {currentUsers.length} of {sortedUsers.length} users
                    </small>
                  </div>
                </div>
              </form>
            </div>

            {/* Users Table */}
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
                      <th 
                        onClick={() => handleSort('status')} 
                        style={{ cursor: 'pointer', width: '100px' }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          Status
                          <i className={`bi ${getSortIcon('status')} text-muted`}></i>
                        </div>
                      </th>
                      <th style={{ width: '120px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <div className="text-muted">
                            <i className="bi bi-person-x display-4 d-block mb-3"></i>
                            {searchQuery ? 'No users found matching your search' : 'No users found'}
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
                            <span className={`badge ${user.status === 1 ? 'bg-success' : 'bg-secondary'} rounded-pill py-2 px-3`} style={{color:'white'}}>
                              <i className={`bi ${user.status === 1 ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                              {user.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleView(user.id)}
                              title="View BioData"
                            >
                              <i className="bi bi-eye me-1"></i>
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
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
                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-people-fill fs-4 text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{users.length}</h5>
                      <p className="text-muted mb-0">Total Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-person-check fs-4 text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {users.filter(u => u.status === 1).length}
                      </h5>
                      <p className="text-muted mb-0">Active Users</p>
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
                      <i className="bi bi-gender-ambiguous fs-4 text-white"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {users.filter(u => u.gender === 'Male').length}
                      </h5>
                      <p className="text-muted mb-0">Male Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="alert alert-info mt-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-info-circle-fill me-3 fs-5"></i>
              <div>
                <h6 className="alert-heading mb-1">BioData Access Information</h6>
                <p className="mb-0 small">
                  Click the "View" button to access detailed biodata for each user. 
                  You can sort by clicking column headers and use search to filter users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BioDataPage;