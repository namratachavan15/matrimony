// src/Components/Admin/DisplayFamily.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useFamilyContext } from "../State/FamilyContext";
import { useUserContext } from "../State/UserContext";

const DisplayFamily = ({ onEdit }) => {
  const { families, deleteFamily, fetchFamilies, searchFamilies } =
    useFamilyContext();
  const { users } = useUserContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFamilies, setFilteredFamilies] = useState(families);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const familiesPerPage = 8;

  // Map uid -> user object for quick lookup
  const userMap = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      map[u.id] = u;
    });
    return map;
  }, [users]);

  // keep filteredFamilies in sync with families from context
  useEffect(() => {
    setFilteredFamilies(families);
  }, [families]);

  // core search logic (used by typing + button)
  const runSearch = async (value) => {
    const trimmed = value.trim();

    if (!trimmed) {
      // empty -> load all families
      await fetchFamilies();
      setCurrentPage(1);
      return;
    }

    // only digits allowed
    if (!/^\d+$/.test(trimmed)) {
      return;
    }

    setIsLoading(true);
    await searchFamilies(trimmed);
    setIsLoading(false);
    setCurrentPage(1);
  };

  // live search while typing
  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // button click search (uses same logic)
  const handleButtonSearch = async (e) => {
    e.preventDefault();
    await runSearch(searchQuery);
  };

  // Handle delete with confirmation
  const handleDelete = async (familyId) => {
    if (window.confirm("Are you sure you want to delete this family record?")) {
      await deleteFamily(familyId);
    }
  };

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedFamilies = React.useMemo(() => {
    if (!sortConfig.key) return filteredFamilies;
    
    return [...filteredFamilies].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredFamilies, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Pagination
  const indexOfLast = currentPage * familiesPerPage;
  const indexOfFirst = indexOfLast - familiesPerPage;
  const currentFamilies = sortedFamilies.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedFamilies.length / familiesPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header  py-3 bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 ">
          <h5 className="mb-0 text-dark">
            <i className="bi bi-house-heart me-2 text-white"></i>
            Family Management
          </h5>
          
          <div className="d-flex gap-2 flex-wrap">
            <div className="input-group" style={{ maxWidth: '300px', height: '38px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by User ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: '100%' }}
              />
              <button 
                className="btn btn-outline-primary d-flex align-items-center justify-content-center"
                type="button"
                onClick={handleButtonSearch}
                style={{ height: '100%', padding: '0 12px' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <i className="bi bi-search"></i>
                )}
              </button>
            </div>
            
            <div className="d-flex align-items-center text-white small">
              <i className="bi bi-info-circle me-1"></i>
              {sortedFamilies.length} families found
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-1">
                    FID
                    <i className={`bi ${getSortIcon('id')} text-muted`}></i>
                  </div>
                </th>
                <th>User</th>
                <th onClick={() => handleSort('father')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-1">
                    Father
                    <i className={`bi ${getSortIcon('father')} text-muted`}></i>
                  </div>
                </th>
                <th>Father Occupation</th>
                <th>Mother</th>
                <th>Mother Occupation</th>
                <th>Brother</th>
                <th>Brother Occupation</th>
                <th>Sister</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentFamilies.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-house display-4 d-block mb-2"></i>
                      No family records found
                    </div>
                  </td>
                </tr>
              ) : (
                currentFamilies.map((f) => {
                  const user = userMap[f.uid] || {};
                  return (
                    <tr key={f.id} className="hover-shadow">
                      <td>
                        <span className="badge bg-primary">#{f.id}</span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">{user.uname || 'N/A'}</div>
                          <small className="text-muted">UID: {f.uid}</small>
                        </div>
                      </td>
                      <td>
                        <div className="fw-medium">{f.father}</div>
                      </td>
                      <td>
                        <small className="text-muted">{f.fatherOccupation}</small>
                      </td>
                      <td>
                        <div className="fw-medium">{f.mother}</div>
                      </td>
                      <td>
                        <small className="text-muted">{f.motherOccupation}</small>
                      </td>
                      <td>
                        <div>{f.brother}</div>
                      </td>
                      <td>
                        <small className="text-muted">{f.brotherOccupation}</small>
                      </td>
                      <td>
                        <div>{f.sister}</div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(f)}
                            title="Edit Family"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(f.id)}
                            title="Delete Family"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedFamilies.length)} of {sortedFamilies.length} entries
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
    </div>
  );
};

export default DisplayFamily;