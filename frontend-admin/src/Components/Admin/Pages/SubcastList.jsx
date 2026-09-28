// src/Components/Subcast/SubcastList.jsx
import React, { useEffect, useState } from "react";
import { useSubcastContext } from "../State/SubcastContext";
import { api } from "../../Config/api";

const SubcastList = ({ onEdit }) => {
  const {
    subcasts,
    fetchSubcasts,
    deleteSubcast,
    loading,
    error,
  } = useSubcastContext();

  const [search, setSearch] = useState("");
  const [castMap, setCastMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  // Load subcasts
  useEffect(() => {
    fetchSubcasts();
  }, []);

  // Load cast list once to map ctid -> cast name
  useEffect(() => {
    const loadCasts = async () => {
      try {
        const { data } = await api.get("/api/admin/cast");
        const map = {};
        (data || []).forEach((c) => {
          map[c.id] = c.cast;
        });
        setCastMap(map);
      } catch (err) {
        console.error("Error fetching cast list for subcast table:", err);
      }
    };
    loadCasts();
  }, []);

  const filteredSubcasts = subcasts.filter((s) => {
    const searchText = search.toLowerCase();
  
    const subcastMatch = s.subcast?.toLowerCase().includes(searchText);
  
    const castName = castMap[s.ctid]?.toLowerCase() || "";
    const castMatch = castName.includes(searchText);
  
    return subcastMatch || castMatch;
  });
  

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, subcasts.length]);

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedSubcasts = React.useMemo(() => {
    if (!sortConfig.key) return filteredSubcasts;
    
    return [...filteredSubcasts].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredSubcasts, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subcast?")) return;
    await deleteSubcast(id);
  };

  // Search function
  const handleButtonSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchSubcasts();
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination calculations
  const totalItems = sortedSubcasts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageItems = sortedSubcasts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h5 className="mb-0 text-dark">
            <i className="bi bi-diagram-3 me-2 text-white"></i>
            Subcast Management
          </h5>
          
          <div className="d-flex gap-2 flex-wrap">
            <div className="input-group" style={{ maxWidth: '300px', height: '38px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Subcast..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
              {sortedSubcasts.length} subcasts found
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th onClick={() => handleSort('id')} style={{ cursor: 'pointer', width: '80px' }}>
                  <div className="d-flex align-items-center gap-1">
                    ID
                    <i className={`bi ${getSortIcon('id')} text-muted`}></i>
                  </div>
                </th>
                <th onClick={() => handleSort('subcast')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-1">
                    Subcast Name
                    <i className={`bi ${getSortIcon('subcast')} text-muted`}></i>
                  </div>
                </th>
                <th>Cast Name</th>
                <th className="text-center" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && subcasts.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-arrow-repeat spinner-border me-2"></i>
                      Loading subcasts...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && currentPageItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-diagram-3 display-4 d-block mb-2"></i>
                      No subcasts found
                    </div>
                  </td>
                </tr>
              )}

              {currentPageItems.map((item) => (
                <tr key={item.id} className="hover-shadow">
                  <td>
                    <span className="badge bg-primary">#{item.id}</span>
                  </td>
                  <td>
                    <div className="fw-semibold">{item.subcast}</div>
                  </td>
                  <td>
                    <span className="badge bg-secondary">{castMap[item.ctid] || item.ctid}</span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit && onEdit(item)}
                        title="Edit Subcast"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(item.id)}
                        title="Delete Subcast"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card-footer bg-white">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="text-muted small">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} entries
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

export default SubcastList;