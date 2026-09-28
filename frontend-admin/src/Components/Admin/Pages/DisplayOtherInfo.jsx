// src/Components/Admin/DisplayOtherInfo.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useOtherInfoContext } from "../State/OtherInfoContext";
import { useUserContext } from "../State/UserContext";
import { useRashiContext } from "../State/RashiContext";
import { useNakshtraContext } from "../State/NakshtraContext";
import { useGanContext } from "../State/GanContext";
import { useNadiContext } from "../State/NadiContext";
import { useGotraContext } from "../State/GotraContext";

const DisplayOtherInfo = ({ onEdit }) => {
  const { otherInfos, deleteOtherInfo, fetchOtherInfos } = useOtherInfoContext();
  const { users } = useUserContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInfos, setFilteredInfos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  const infosPerPage = 8;

  const { rashis,fetchRashis } = useRashiContext();

  const {nakshtras,fetchNakshtras}=useNakshtraContext();

  const {gans,fetchGans}=useGanContext();

  const{gotras,fetchGotras}=useGotraContext();

 const{nadis,fetchNadis}=useNadiContext();


  const userMap = useMemo(() => {
    const map = {};
    users.forEach(u => (map[u.id] = u));
    return map;
  }, [users]);

  const rashiMap = useMemo(() => {
    const map = {};
    rashis.forEach(r => (map[r.id] = r.ras));
    return map;
  }, [rashis]);

  const nakshtraMap = useMemo(() => {
    const map = {};
    nakshtras.forEach(n => (map[n.id] = n.nakshtra));
    return map;
  }, [nakshtras]);

  const ganMap = useMemo(() => {
    const map = {};
    gans.forEach(g => (map[g.id] = g.gan));
    return map;
  }, [gans]);


  const nadiMap = useMemo(() => {
    const map = {};
    nadis.forEach(n => (map[n.id] = n.nadi));
    return map;
  }, [nadis]);

  const gotraMap = useMemo(() => {
    const map = {};
    gotras.forEach(g => (map[g.id] = g.gotra));
    return map;
  }, [gotras]);

  
  // Fetch all data initially
  useEffect(() => {
    fetchOtherInfos();
    fetchRashis();
    fetchNakshtras();
    fetchGans();
    fetchNadis();
    fetchGotras();
  }, []);

  // Update filtered list whenever otherInfos or searchQuery changes (instant search)
  useEffect(() => {
    if (!searchQuery) {
      setFilteredInfos(otherInfos);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredInfos(
        otherInfos.filter(
          info =>
            info.uid.toString().includes(q) ||
            (userMap[info.uid]?.uname || "").toLowerCase().includes(q)
        )
      );
    }
    setCurrentPage(1);
  }, [searchQuery, otherInfos, userMap]);

  // Search on button click
  const handleButtonSearch = async e => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchOtherInfos(searchQuery);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
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

  const sortedInfos = React.useMemo(() => {
    if (!sortConfig.key) return filteredInfos;
    
    return [...filteredInfos].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredInfos, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Handle delete with confirmation
  const handleDelete = async (infoId) => {
    if (window.confirm("Are you sure you want to delete this astrological information?")) {
      await deleteOtherInfo(infoId);
    }
  };

  // Pagination logic
  const indexOfLast = currentPage * infosPerPage;
  const indexOfFirst = indexOfLast - infosPerPage;
  const currentInfos = sortedInfos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedInfos.length / infosPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header py-3 bg-primary text-white">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 ">
          <h5 className="mb-0 text-dark">
            <i className="bi bi-stars me-2 text-white"></i>
            Astrological Information
          </h5>
          
          <div className="d-flex gap-2 flex-wrap">
            <div className="input-group" style={{ maxWidth: '300px', height: '38px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by User ID or Name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
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
              {sortedInfos.length} records found
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
                    ID
                    <i className={`bi ${getSortIcon('id')} text-muted`}></i>
                  </div>
                </th>
                <th>User</th>
                <th onClick={() => handleSort('rsid')} style={{ cursor: 'pointer' }}>
                  <div className="d-flex align-items-center gap-1">
                    Rashi
                    <i className={`bi ${getSortIcon('rsid')} text-muted`}></i>
                  </div>
                </th>
                <th>Nakshtra</th>
                <th>Gan</th>
                <th>Nadi</th>
                <th>Gotra</th>
                <th>Charan</th>
                <th>Mangal</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentInfos.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    <div className="text-muted">
                      <i className="bi bi-stars display-4 d-block mb-2"></i>
                      No astrological records found
                    </div>
                  </td>
                </tr>
              ) : (
                currentInfos.map(info => {
                  const user = userMap[info.uid] || {};
                  return (
                    <tr key={info.id} className="hover-shadow">
                      <td>
                        <span className="badge bg-primary">#{info.id}</span>
                      </td>
                      <td>
                        <div>
                          <div className="fw-semibold">{user.uname || 'N/A'}</div>
                          <small className="text-muted">UID: {info.uid}</small>
                        </div>
                      </td>
                      <td>
                        <div>{rashiMap[info.rsid] || info.rsid}</div>
                      </td>
                      <td>
                        <div>{nakshtraMap[info.nkid]}</div>
                      </td>
                      <td>
                        <div>{ganMap[info.gnid]}</div>
                      </td>
                      <td>
                        <div>{nadiMap[info.ndid]}</div>
                      </td>
                      <td>
                        <div>{gotraMap[info.gid]}</div>
                      </td>
                      <td>
                        <div>{info.charan}</div>
                      </td>
                      <td>
                        <span className={`badge ${
                          info.managal === 'Yes' ? 'bg-danger' : 
                          info.managal === 'No' ? 'bg-success' : 
                          'bg-warning'
                        }`}>
                          {info.managal}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-1">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEdit(info)}
                            title="Edit Information"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(info.id)}
                            title="Delete Information"
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
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, sortedInfos.length)} of {sortedInfos.length} entries
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

export default DisplayOtherInfo;