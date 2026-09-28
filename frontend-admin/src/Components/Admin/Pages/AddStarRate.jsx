// src/Components/Admin/AddStarRate.jsx
import React, { useState, useEffect } from "react";
import { useUserContext } from "../State/UserContext";
import { FaPlus, FaMinus, FaStar, FaSearch } from "react-icons/fa";
import './AddStarRate.css'

const AddStarRate = () => {
  const { users, loading, fetchUsers, updateStarCount } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [updatingStar, setUpdatingStar] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.uname?.toLowerCase().includes(query) ||
        user.id?.toString().includes(query) ||
        user.umobile?.includes(query)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [users, searchQuery]);

  const handleUpdateStar = async (userId, newStarCount) => {
    if (newStarCount < 0 || newStarCount > 5) return;
    
    setUpdatingStar(userId);
    try {
      await updateStarCount(userId, newStarCount);
    } catch (err) {
      console.error("Failed to update star count:", err);
      alert("❌ Failed to update star rating");
    } finally {
      setUpdatingStar(null);
    }
  };

  const incrementStar = (user) => {
    if (user.starcount < 5) {
      handleUpdateStar(user.id, user.starcount + 1);
    }
  };

  const decrementStar = (user) => {
    if (user.starcount > 0) {
      handleUpdateStar(user.id, user.starcount - 1);
    }
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Pagination controls
  const getPaginationRange = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-star-fill me-2 text-primary"></i>
                Star Rating Management
              </h2>
              <p className="text-muted mb-0">
                Manage user star ratings (0-5 stars)
              </p>
            </div>
            
            <div className="d-flex align-items-center text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              {filteredUsers.length} users found
            </div>
          </div>

          {/* Search Bar */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-3">
              <div className="input-group">
                <span className="input-group-text bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search by ID, Name, or Mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  className="btn btn-outline-primary" 
                  type="button"
                  onClick={() => setSearchQuery("")}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-dark py-3">
              <h5 className="mb-0">
                <i className="bi bi-star-fill me-2"></i>
                User Star Ratings
              </h5>
            </div>
            
            {loading ? (
              <div className="card-body text-center py-5">
                <div className="spinner-border text-warning" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading users...</p>
              </div>
            ) : (
              <>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="ps-4">Profile ID</th>
                          <th>Name</th>
                          <th>Mobile Number</th>
                          <th>Current Stars</th>
                          <th className="text-center">Rating</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentUsers.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="text-center py-4">
                              <div className="text-muted">
                                <i className="bi bi-person-x display-4 d-block mb-2"></i>
                                No users found
                              </div>
                            </td>
                          </tr>
                        ) : (
                          currentUsers.map((user) => (
                            <tr key={user.id} className="hover-shadow">
                              <td className="ps-4">
                                <span className="badge bg-primary" style={{color:'white'}}>
                                  #{user.id}
                                </span>
                              </td>
                              <td>
                                <div className="fw-semibold">{user.uname || 'N/A'}</div>
                              </td>
                              <td>
                                <div className="text-muted">
                                  <i className="bi bi-phone me-1"></i>
                                  {user.umobile || 'N/A'}
                                </div>
                              </td>
                              <td>
                                <span className="badge bg-warning bg-opacity-20 text-dark">
                                  <i className="bi bi-star me-1"></i>
                                  {user.starcount || 0}/5
                                </span>
                              </td>
                              <td className="text-center">
                                <div className="d-flex justify-content-center">
                                  {[...Array(5)].map((_, index) => (
                                    <FaStar
                                      key={index}
                                      size={20}
                                      className="me-1"
                                      color={index < (user.starcount || 0) ? "#FFD700" : "#e4e5e9"}
                                    />
                                  ))}
                                </div>
                              </td>
                              <td className="text-center">
                                <div className="btn-group btn-group-sm">
                                  <button
                                    className="btn btn-outline-success"
                                    onClick={() => incrementStar(user)}
                                    disabled={updatingStar === user.id || (user.starcount || 0) >= 5}
                                  >
                                    {updatingStar === user.id && user.starcount === (user.starcount || 0) + 1 ? (
                                      <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                      <>
                                        <FaPlus className="me-1" />
                                    
                                      </>
                                    )}
                                  </button>
                                  
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => decrementStar(user)}
                                    disabled={updatingStar === user.id || (user.starcount || 0) <= 0}
                                  >
                                    {updatingStar === user.id && user.starcount === (user.starcount || 0) - 1 ? (
                                      <span className="spinner-border spinner-border-sm" />
                                    ) : (
                                      <>
                                        <FaMinus className="me-1" />
                                        
                                      </>
                                    )}
                                  </button>
                                </div>
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
                        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
                      </div>
                      
                      <nav>
                        <ul className="pagination pagination-sm mb-0">
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(1)}
                              disabled={currentPage === 1}
                            >
                              <i className="bi bi-chevron-double-left"></i>
                            </button>
                          </li>
                          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              <i className="bi bi-chevron-left"></i>
                            </button>
                          </li>
                          
                          {getPaginationRange().map((pageNum, idx) => (
                            <li 
                              key={idx} 
                              className={`page-item ${
                                pageNum === currentPage ? 'active' : 
                                pageNum === '...' ? 'disabled' : ''
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
                                disabled={pageNum === '...'}
                              >
                                {pageNum}
                              </button>
                            </li>
                          ))}
                          
                          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                              className="page-link"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage === totalPages}
                            >
                              <i className="bi bi-chevron-right"></i>
                            </button>
                          </li>
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
              </>
            )}
          </div>

        
        </div>
      </div>
    </div>
  );
};

export default AddStarRate;