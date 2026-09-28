import React, { useState, useEffect, useMemo } from "react";
import { useAboutContext } from "../State/AboutContext";
import { useCastContext } from "../State/CastContext";

const AboutList = ({ onEdit }) => {
  const { abouts, deleteAbout } = useAboutContext();
  const { cast } = useCastContext();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter based on search
  const filtered = useMemo(() => {
    return abouts.filter(
      (a) =>
        a.about.toLowerCase().includes(search.toLowerCase()) ||
        cast.find((c) => c.id === a.castId)?.cast.toLowerCase().includes(search.toLowerCase())
    );
  }, [abouts, cast, search]);

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1); // reset page when search changes
  }, [search, abouts.length]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle delete with confirmation
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this about entry?")) return;
    deleteAbout(id);
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3 bg-primary text-white">
        <h5 className="mb-0 text-dark">
          <i className="bi bi-file-text me-2 text-white"></i>
          About List
        </h5>

        <div className="d-flex gap-2 flex-wrap">
          <div className="input-group" style={{ maxWidth: "300px", height: "38px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search About..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: "100%" }}
            />
            <button
              className="btn btn-outline-primary d-flex align-items-center justify-content-center"
              type="button"
              style={{ height: "100%", padding: "0 12px" }}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
          <div className="d-flex align-items-center text-white small">
            <i className="bi bi-info-circle me-1"></i>
            {filtered.length} entries found
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "80px" }}>ID</th>
                <th>Cast</th>
                <th>About</th>
                <th>Status</th>
                <th className="text-center" style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPageItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-muted">
                    <i className="bi bi-file-earmark-text display-4 d-block mb-2"></i>
                    No records found
                  </td>
                </tr>
              )}
              {currentPageItems.map((a) => {
                const castName = cast.find((c) => c.id === a.castId)?.cast || "";
                return (
                  <tr key={a.id} className="hover-shadow">
                    <td>
                      <span className="badge bg-primary">#{a.id}</span>
                    </td>
                    <td>{castName}</td>
                    <td>{a.about}</td>
                    <td>
                      {a.status === 1 ? (
                        <span className="badge bg-success">Active</span>
                      ) : (
                        <span className="badge bg-danger">Inactive</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit && onEdit(a)}
                          title="Edit About"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(a.id)}
                          title="Delete About"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(1)}>
                    <i className="bi bi-chevron-double-left"></i>
                  </button>
                </li>
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
                      <button className="page-link" onClick={() => goToPage(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => goToPage(totalPages)}>
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

export default AboutList;
