// src/Components/Nadi/NadiList.jsx
import React, { useEffect, useState } from "react";
import { useNadiContext } from "../State/NadiContext";

const NadiList = ({ onEdit }) => {
  const { nadis, fetchNadis, deleteNadi, loading, error } = useNadiContext();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchNadis();
  }, []);

  const filtered = nadis.filter((n) =>
    n.nadi?.toLowerCase().includes(search.toLowerCase())
  );

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedNadis = React.useMemo(() => {
    if (!sortConfig.key) return filtered;
    
    return [...filtered].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filtered, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Handle delete with confirmation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Nadi?")) return;
    await deleteNadi(id);
  };

  // Search function
  const handleButtonSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchNadis();
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalItems = sortedNadis.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedNadis.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, nadis.length]);

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-primary text-white py-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h5 className="mb-0 text-dark">
            <i className="bi bi-droplet me-2 text-white"></i>
            Nadi Management
          </h5>
          
          <div className="d-flex gap-2 flex-wrap">
            <div className="input-group" style={{ maxWidth: '300px', height: '38px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Nadi..."
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
              {sortedNadis.length} nadis found
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
                <th onClick={() => handleSort('nadi')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-1">
                    Nadi Name
                    <i className={`bi ${getSortIcon('nadi')} text-muted`}></i>
                  </div>
                </th>
                <th className="text-center" style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && nadis.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-arrow-repeat spinner-border me-2"></i>
                      Loading nadis...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && currentItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-droplet display-4 d-block mb-2"></i>
                      No nadis found
                    </div>
                  </td>
                </tr>
              )}

              {currentItems.map((n) => (
                <tr key={n.id} className="hover-shadow">
                  <td>
                    <span className="badge bg-primary">#{n.id}</span>
                  </td>
                  <td>
                    <div className="fw-semibold">{n.nadi}</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit && onEdit(n)}
                        title="Edit Nadi"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(n.id)}
                        title="Delete Nadi"
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

export default NadiList;