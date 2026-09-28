import React, { useState, useEffect, useMemo } from "react";
import { useTestimonialContext } from "../State/TestimonialContext";

const TestimonialList = ({ onEdit }) => {
  const { testimonials, deleteTestimonial } = useTestimonialContext();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter by name or testimonial text
  const filtered = useMemo(() => {
    return testimonials.filter(
      t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.testimonial.toLowerCase().includes(search.toLowerCase())
    );
  }, [testimonials, search]);

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => setCurrentPage(1), [search, testimonials.length]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Handle delete with confirmation
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      deleteTestimonial(id);
      // Optional: reset page if last item deleted
      if ((currentPage - 1) * itemsPerPage >= totalItems - 1) {
        setCurrentPage(Math.max(currentPage - 1, 1));
      }
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-3 bg-primary text-white">
        <h5 className="mb-0 text-dark">
          <i className="bi bi-chat-text me-2 text-white"></i>
          Testimonial List
        </h5>

        <div className="d-flex gap-2 flex-wrap">
          <div className="input-group" style={{ maxWidth: "300px", height: "38px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search Name or Feedback..."
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
                <th>ID</th>
                <th>Name</th>
                <th>Feedback</th>
                <th>Photo</th>
                <th>Status</th>
                <th className="text-center" style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-muted">
                    <i className="bi bi-chat-text display-4 d-block mb-2"></i>
                    No testimonials found
                  </td>
                </tr>
              )}
              {currentItems.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.name}</td>
                  <td>{t.testimonial}</td>
                  <td>
                    <img
                      src={`http://localhost:5454/uploads/testimonials/${t.simg}`}
                      width="60"
                      className="rounded"
                    />
                  </td>
                  <td>
                    {t.status === 1 ? (
                      <span className="badge bg-success">Visible</span>
                    ) : (
                      <span className="badge bg-danger">Hidden</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onEdit && onEdit(t)}
                        title="Edit Testimonial"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(t.id)}
                        title="Delete Testimonial"
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

export default TestimonialList;
