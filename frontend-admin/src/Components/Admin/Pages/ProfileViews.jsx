import React, { useEffect, useState, useMemo } from "react";
import { useUserContext } from "../State/UserContext";
import { FaRedo, FaEye } from "react-icons/fa";

const ProfileViews = () => {
  const { profileViews, fetchProfileViews, viewProfileViewers } = useUserContext();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewers, setViewers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const pageSize = 10;
  const backendURL = "http://localhost:5454/";

  // Load profile views on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProfileViews("");
      } catch (error) {
        console.error("Error loading profile views:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Live search (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProfileViews(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

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

  // Sort profile views
  const sortedProfileViews = useMemo(() => {
    if (!sortConfig.key) return profileViews || [];
    
    return [...(profileViews || [])].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [profileViews, sortConfig]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil((sortedProfileViews?.length || 0) / pageSize));
  const indexOfLast = page * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const currentData = sortedProfileViews.slice(indexOfFirst, indexOfLast);

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 3) {
      for (let i = 1; i <= 5; i++) pages.push(i);
    } else if (page >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
    } else {
      for (let i = page - 2; i <= page + 2; i++) pages.push(i);
    }
    
    return pages;
  };

  const resetSearch = () => {
    setSearch("");
    fetchProfileViews("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProfileViews(search);
  };

  // Fetch viewers of a profile
  const handleViewClick = async (profileId) => {
    try {
      setLoading(true);
      const data = await viewProfileViewers(profileId);
      setViewers(data);
      setSelectedProfile(profileId);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching viewers:", err);
      setViewers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="row">
        <div className="col-12">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="h4 mb-1 text-dark">
                <i className="bi bi-eye-fill me-2 text-info"></i>
                Profile Views
              </h2>
              <p className="text-muted mb-0">
                Track which profiles were viewed and by whom
              </p>
            </div>
            
            <div className="text-muted">
              <i className="bi bi-eye me-1"></i>
              {sortedProfileViews.length} profile views
            </div>
          </div>

          {/* Main Card */}
          <div className="card shadow-lg border-0">
            {/* Card Header */}
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  <i className="bi bi-eye me-2"></i>
                  Profile View History
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
                        placeholder="Search by name, mobile or profile ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button 
                        className="btn btn-info text-white" 
                        type="submit"
                      >
                        <i className="bi bi-search me-2"></i>
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
                      Showing {currentData.length} of {sortedProfileViews.length} views
                    </small>
                  </div>
                </div>
              </form>
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-info" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading profile views...</p>
              </div>
            )}

            {/* Profile Views Table */}
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
                          onClick={() => handleSort('profileId')} 
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            Profile ID
                            <i className={`bi ${getSortIcon('profileId')} text-muted`}></i>
                          </div>
                        </th>
                        <th 
                          onClick={() => handleSort('username')} 
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="d-flex align-items-center gap-1">
                            Username
                            <i className={`bi ${getSortIcon('username')} text-muted`}></i>
                          </div>
                        </th>
                        <th>Mobile</th>
                        <th style={{ width: '100px' }}>Viewers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentData.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-5">
                            <div className="text-muted">
                              <i className="bi bi-eye-slash display-4 d-block mb-3 text-info"></i>
                              {search ? 'No profile views found matching your search' : 'No profile views found'}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentData.map((v) => (
                          <tr key={v.id} className="hover-shadow">
                            <td>
                            <span className="badge bg-primary" style={{color:'white'}}>#{v.id}</span>
                            </td>
                            <td>
                              <div className="fw-semibold">
                                <i className="bi bi-person-badge me-2"></i>
                                {v.profileId}
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">{v.username}</div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-telephone text-muted me-2"></i>
                                {v.mobile}
                              </div>
                            </td>
                            <td>
                              <button
                                className="btn btn-outline-info btn-sm"
                                onClick={() => handleViewClick(v.profileId)}
                                title="View who viewed this profile"
                              >
                                <FaEye className="me-1" />
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
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="card-footer bg-white">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="text-muted small">
                    Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedProfileViews.length)} of {sortedProfileViews.length} entries
                  </div>
                  
                  <nav>
                    <ul className="pagination pagination-sm mb-0">
                      {/* First Page */}
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                        >
                          <i className="bi bi-chevron-double-left"></i>
                        </button>
                      </li>
                      
                      {/* Previous Page */}
                      <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(prev => prev - 1)}
                          disabled={page === 1}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </button>
                      </li>
                      
                      {/* Page Numbers */}
                      {getPageNumbers().map(pageNum => (
                        <li 
                          key={pageNum} 
                          className={`page-item ${page === pageNum ? 'active' : ''}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setPage(pageNum)}
                          >
                            {pageNum}
                          </button>
                        </li>
                      ))}
                      
                      {/* Next Page */}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(prev => prev + 1)}
                          disabled={page === totalPages}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </button>
                      </li>
                      
                      {/* Last Page */}
                      <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                        <button
                          className="page-link"
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
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
                    <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-eye-fill fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{sortedProfileViews.length}</h5>
                      <p className="text-muted mb-0">Total Profile Views</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card bg-light border-0">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                      <i className="bi bi-people-fill fs-4 " style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {new Set(sortedProfileViews.map(v => v.profileId)).size}
                      </h5>
                      <p className="text-muted mb-0">Unique Profiles Viewed</p>
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
                      <i className="bi bi-bar-chart-fill fs-4" style={{color:'white'}}></i>
                    </div>
                    <div>
                      <h5 className="mb-1">
                        {Math.round(sortedProfileViews.length / Math.max(1, new Set(sortedProfileViews.map(v => v.profileId)).size))}
                      </h5>
                      <p className="text-muted mb-0">Avg Views per Profile</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for viewers */}
      {modalOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-gradient-info text-white">
                <h5 className="modal-title">
                  <i className="bi bi-eye-fill me-2"></i>
                  Users Who Viewed Profile #{selectedProfile}
                </h5>
                <button className="btn-close btn-close-white" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-2">Loading viewers...</p>
                  </div>
                ) : viewers.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Viewer ID</th>
                          <th>Photo</th>
                          <th>Name</th>
                          <th>Mobile</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewers.map((viewer) => (
                          <tr key={viewer.userId}>
                            <td>
                              <span className="badge bg-secondary">#{viewer.userId}</span>
                            </td>
                            <td>
                              <div className="avatar-container">
                                <img
                                  src={
                                    viewer.photo
                                      ? viewer.photo.startsWith("http")
                                        ? viewer.photo
                                        : `${backendURL}uploads/profile/${viewer.photo}`
                                      : '/default-avatar.png'
                                  }
                                  alt={viewer.username}
                                  className="avatar-img"
                                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                                />
                              </div>
                            </td>
                            <td>
                              <div className="fw-semibold">{viewer.username}</div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <i className="bi bi-telephone text-muted me-2"></i>
                                {viewer.mobile}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${viewer.status === 1 ? 'bg-success' : 'bg-danger'} rounded-pill`}>
                                <i className={`bi ${viewer.status === 1 ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                {viewer.status === 1 ? 'Active' : 'Deactive'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-eye-slash display-4 text-muted d-block mb-3"></i>
                    <p className="text-muted">No viewers found for this profile.</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-info" onClick={() => setModalOpen(false)}>
                  <i className="bi bi-x-circle me-1"></i>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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
        .hover-shadow:hover {
          box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
          transition: box-shadow 0.2s ease;
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #6b2340 0%, #138496 100%);
        }
      `}</style>
    </div>
  );
};

export default ProfileViews;