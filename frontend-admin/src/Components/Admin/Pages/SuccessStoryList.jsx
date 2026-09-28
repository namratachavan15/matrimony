import React, { useEffect, useState, useMemo } from "react";
import { useStoryContext } from "../State/StoryContext";

const SuccessStoryList = ({ onEdit }) => {
  const { stories, fetchStories, deleteStory, loading } = useStoryContext();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchStories();
  }, []);

  // Filter by Bride or Groom name
  const filteredStories = useMemo(() =>
    stories.filter(s =>
      s.bridename.toLowerCase().includes(search.toLowerCase()) ||
      s.groomname.toLowerCase().includes(search.toLowerCase())
    ),
    [stories, search]
  );

  // Reset page when search changes
  useEffect(() => setCurrentPage(1), [search, stories.length]);

  // Sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedStories = useMemo(() => {
    if (!sortConfig.key) return filteredStories;
    return [...filteredStories].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStories, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'bi-arrow-down-up';
    return sortConfig.direction === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  };

  // Pagination
  const totalItems = sortedStories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedStories.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      await deleteStory(id);
      if ((currentPage - 1) * itemsPerPage >= totalItems - 1) setCurrentPage(Math.max(currentPage - 1, 1));
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header d-flex justify-content-between align-items-center  bg-primary text-white">

     
        <h6 className="mb-0">Success Story List</h6>
        <input
          className="form-control w-25"
          placeholder="Search Bride/Groom..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card-body p-0 table-responsive">
        <table className="table table-bordered table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID <i className={`bi ${getSortIcon('id')}`}></i>
              </th>
              <th onClick={() => handleSort('bridename')} style={{ cursor: 'pointer' }}>
                Bride <i className={`bi ${getSortIcon('bridename')}`}></i>
              </th>
              <th onClick={() => handleSort('groomname')} style={{ cursor: 'pointer' }}>
                Groom <i className={`bi ${getSortIcon('groomname')}`}></i>
              </th>
              <th>Date</th>
              <th>Photo</th>
              <th>Feedback</th>
              <th>Status</th>
              <th width="120">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && stories.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  <i className="bi bi-arrow-repeat spinner-border me-2"></i>
                  Loading stories...
                </td>
              </tr>
            )}

            {!loading && currentItems.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  No stories found
                </td>
              </tr>
            )}

            {currentItems.map(s => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.bridename}</td>
                <td>{s.groomname}</td>
                <td>{s.marriageDate}</td>
                <td>
                  <img
                    src={`http://localhost:5454/uploads/stories/${s.simg}`}
                    width="60"
                    className="rounded"
                  />
                </td>
                <td>{s.feedback}</td>
                <td>
                  {s.status === 1 ? <span className="badge bg-success">Visible</span> : <span className="badge bg-danger">Hidden</span>}
                </td>
                <td>
                  <div className="d-flex justify-content-center gap-1">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => onEdit(s)}
                      title="Edit Story"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(s.id)}
                      title="Delete Story"
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card-footer d-flex justify-content-between">
          <button className="btn btn-secondary btn-sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <span className="text-muted">Page {currentPage} of {totalPages}</span>
          <button className="btn btn-secondary btn-sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessStoryList;
