// src/Component/Admin/DisplayUser.jsx - Matching Dark Blue Sidebar Theme
import React, { useState, useEffect } from "react";
import { useUserContext } from "../State/UserContext";

const DisplayUser = ({ onEdit, theme: propTheme }) => {
  const { users, deleteUser } = useUserContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const usersPerPage = 8;
  const backendURL = "http://localhost:5454/";

  // Theme matching sidebar - Dark Blue/Navy
  const theme = propTheme || {
    primary: '#5b1730',
    primaryDark: '#421021',
    primaryLight: '#7b2946',
    secondary: '#c9a227',
    bgLight: '#fbf8f3',
    border: '#eadfd4',
    textDark: '#2f2426',
    textMuted: '#766a6d'
  };

  useEffect(() => {
    handleSearch();
  }, [searchQuery, users]);

  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            String(u.id).includes(query) ||
            (u.uname && u.uname.toLowerCase().includes(query)) ||
            (u.umobile && String(u.umobile).includes(query)) ||
            (u.email && u.email.toLowerCase().includes(query))
        )
      );
    }
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = React.useMemo(() => {
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  return (
    <div className="card shadow-sm border-0 user-management-premium" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <div className="py-3 px-4" style={{ background: theme.primary }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h5 className="mb-0 text-white">
            <i className="bi bi-people me-2"></i>
            User Management
          </h5>
          
          <div className="d-flex gap-2 flex-wrap">
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, mobile, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ borderRadius: '30px 0 0 30px', border: 'none' }}
              />
              <button 
                className="btn d-flex align-items-center justify-content-center"
                type="button"
                style={{ 
                  background: 'white', 
                  color: theme.primary,
                  borderRadius: '0 30px 30px 0',
                  border: 'none'
                }}
              >
                <i className="bi bi-search"></i>
              </button>
            </div>
            
            <div className="d-flex align-items-center text-white-50 small">
              <i className="bi bi-info-circle me-1"></i>
              {sortedUsers.length} users found
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead style={{ background: theme.bgLight }}>
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer', color: theme.textDark, padding: '12px 8px' }}>
                  <div className="d-flex align-items-center gap-1">
                    ID
                    <i className={`bi ${getSortIcon('id')}`} style={{ color: theme.textMuted }}></i>
                  </div>
                </th>
                <th style={{ color: theme.textDark }}>Profile</th>
                <th onClick={() => handleSort('uname')} style={{ cursor: 'pointer', color: theme.textDark }}>
                  <div className="d-flex align-items-center gap-1">
                    Name
                    <i className={`bi ${getSortIcon('uname')}`} style={{ color: theme.textMuted }}></i>
                  </div>
                </th>
                <th style={{ color: theme.textDark }}>Contact</th>
                <th style={{ color: theme.textDark }}>Location</th>
                <th onClick={() => handleSort('jdate')} style={{ cursor: 'pointer', color: theme.textDark }}>
                  <div className="d-flex align-items-center gap-1">
                    Joined
                    <i className={`bi ${getSortIcon('jdate')}`} style={{ color: theme.textMuted }}></i>
                  </div>
                </th>
                <th className="text-center" style={{ color: theme.textDark }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div style={{ color: theme.textMuted }}>
                      <i className="bi bi-people display-4 d-block mb-2"></i>
                      No users found
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr key={user.id} style={{ borderBottomColor: theme.border }}>
                    <td>
                      <span style={{ 
                        background: theme.bgLight, 
                        color: theme.primary,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500
                      }}>
                        #{user.id}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            user.uprofile
                              ? user.uprofile.startsWith("http")
                                ? user.uprofile
                                : `${backendURL}uploads/profile/${user.uprofile}`
                              : '/default-avatar.png'
                          }
                          alt="Profile"
                          className="rounded-circle"
                          style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'cover',
                            border: `2px solid ${theme.border}`
                          }}
                          onError={(e) => {
                            e.target.src = '/default-avatar.png';
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="fw-semibold" style={{ color: theme.textDark }}>{user.uname || 'N/A'}</div>
                        <small style={{ color: theme.textMuted }}>{user.email || 'No email'}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="text-nowrap">
                          <i className="bi bi-phone me-1" style={{ color: theme.secondary }}></i>
                          <span style={{ color: theme.textDark }}>{user.umobile || 'N/A'}</span>
                        </div>
                        {user.whatsappno && (
                          <small style={{ color: theme.textMuted }}>
                            <i className="bi bi-whatsapp me-1" style={{ color: '#25D366' }}></i>
                            {user.whatsappno}
                          </small>
                        )}
                      </div>
                    </td>
                    <td>
                      <small style={{ color: theme.textMuted }}>
                        {user.address ? 
                          `${user.address.substring(0, 30)}${user.address.length > 30 ? '...' : ''}` 
                          : 'N/A'
                        }
                      </small>
                    </td>
                    <td>
                      <small style={{ color: theme.textMuted }}>
                        {user.jdate ? new Date(user.jdate).toLocaleDateString() : 'N/A'}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm d-flex align-items-center gap-1"
                          onClick={() => onEdit(user)}
                          title="Edit User"
                          style={{
                            background: theme.bgLight,
                            border: `1px solid ${theme.border}`,
                            color: theme.primary,
                            borderRadius: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = theme.primary;
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = theme.bgLight;
                            e.currentTarget.style.color = theme.primary;
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm d-flex align-items-center gap-1"
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this user?')) {
                              deleteUser(user.id);
                            }
                          }}
                          title="Delete User"
                          style={{
                            background: '#fdf9f3',
                            border: `1px solid ${theme.border}`,
                            color: '#7a1725',
                            borderRadius: '8px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#7a1725';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fdf9f3';
                            e.currentTarget.style.color = '#7a1725';
                          }}
                        >
                          <i className="bi bi-trash"></i>
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
        <div className="card-footer bg-white py-3" style={{ borderTop: `1px solid ${theme.border}` }}>
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div style={{ color: theme.textMuted, fontSize: '14px' }}>
              Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, sortedUsers.length)} of {sortedUsers.length} entries
            </div>
            
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    style={{ color: theme.primary, borderRadius: '8px' }}
                  >
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ color: theme.primary, borderRadius: '8px' }}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(pageNum)}
                        style={currentPage === pageNum ? {
                          background: theme.primary,
                          borderColor: theme.primary,
                          color: 'white',
                          borderRadius: '8px'
                        } : {
                          color: theme.textDark,
                          borderRadius: '8px'
                        }}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    style={{ color: theme.primary, borderRadius: '8px' }}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    style={{ color: theme.primary, borderRadius: '8px' }}
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
  );
};

export default DisplayUser;