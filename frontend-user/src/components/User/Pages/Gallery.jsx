import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaHeart,
  FaSearchPlus,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaCalendar,
  FaShareAlt,
  FaExpand,
  FaFilter,
  FaImage
} from "react-icons/fa";
import "./Gallery.css";

const Gallery = () => {
  const [stories, setStories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:5454/api/admin/story")
      .then(res => {
        const sortedData = res.data.sort((a, b) => {
          const dateA = new Date(a.marriageDate);
          const dateB = new Date(b.marriageDate);
          return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });
        setStories(sortedData);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [sortBy]);

  const openImageViewer = (story, index) => {
    setSelectedImage(story.simg);
    setCurrentIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % stories.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(stories[nextIndex]?.simg);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? stories.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setSelectedImage(stories[prevIndex]?.simg);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleShare = (story) => {
    const shareUrl = window.location.href;
    const text = `Check out ${story.bridename} & ${story.groomname}'s beautiful wedding story!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Success Story',
        text: text,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="gallery-loader">
        <div className="loader-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <p>Loading beautiful memories...</p>
      </div>
    );
  }

  return (
    <div className="modern-gallery">
      {/* Header */}
      <div className="gallery-header-modern">
        <div className="header-content-modern">
          <div className="header-left">
            <h1 className="gallery-title-modern">
              <FaHeart className="title-icon" />
              Success Stories Gallery
            </h1>
            <p className="gallery-subtitle">
              Celebrating love and lifelong commitments
            </p>
          </div>
          <div className="header-right">
            <div className="gallery-stats">
              <span className="stat-count">{stories.length}</span>
              <span className="stat-label">Beautiful Stories</span>
            </div>
            <button 
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Sort
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="filter-options">
            <div className="filter-group">
              <label>Sort by:</label>
              <select 
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      <div className="gallery-container-modern">
        {stories.length === 0 ? (
          <div className="empty-gallery">
            <FaImage className="empty-icon" />
            <h3>No stories yet</h3>
            <p>Beautiful moments coming soon!</p>
          </div>
        ) : (
          <div className="gallery-grid-modern">
            {stories.map((story, index) => (
              <div 
                key={story.id} 
                className="gallery-item-modern"
                onClick={() => openImageViewer(story, index)}
              >
                <div className="image-container">
                  <img
                    src={`http://localhost:5454/uploads/stories/${story.simg}`}
                    alt={`${story.bridename} & ${story.groomname}`}
                    className="gallery-image-modern"
                  />
                  <div className="image-hover-overlay">
                    <FaSearchPlus className="zoom-icon" />
                    <div className="hover-info">
                      <h4>{story.bridename} & {story.groomname}</h4>
                      <p><FaCalendar /> {formatDate(story.marriageDate)}</p>
                    </div>
                  </div>
                  <div className="love-badge">
                    <FaHeart />
                  </div>
                </div>
                <div className="gallery-item-info">
                  <h3 className="couple-name">
                    {story.bridename} ❤️ {story.groomname}
                  </h3>
                  <div className="item-meta">
                    <span className="wedding-date">
                      <FaCalendar /> {formatDate(story.marriageDate)}
                    </span>
                    <button 
                      className="share-btn-small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(story);
                      }}
                    >
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox-modal" onClick={closeImageViewer}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button className="lightbox-close-btn" onClick={closeImageViewer}>
              <FaTimes />
            </button>

            {/* Navigation */}
            {stories.length > 1 && (
              <>
                <button className="nav-btn prev-btn" onClick={prevImage}>
                  <FaChevronLeft />
                </button>
                <button className="nav-btn next-btn" onClick={nextImage}>
                  <FaChevronRight />
                </button>
              </>
            )}

            {/* Main Image */}
            <div className="lightbox-image-wrapper">
              <img
                src={`http://localhost:5454/uploads/stories/${selectedImage}`}
                alt="Success Story"
                className="lightbox-main-image"
              />
            </div>

            {/* Image Info */}
            <div className="lightbox-info-panel">
              <div className="lightbox-header">
                <h2>{stories[currentIndex]?.bridename} & {stories[currentIndex]?.groomname}</h2>
                <div className="lightbox-meta">
                  <span className="meta-item">
                    <FaCalendar /> {formatDate(stories[currentIndex]?.marriageDate)}
                  </span>
                  <span className="meta-item">
                    Image {currentIndex + 1} of {stories.length}
                  </span>
                </div>
              </div>
              
              {stories[currentIndex]?.story && (
                <div className="story-description">
                  <p>{stories[currentIndex].story}</p>
                </div>
              )}

              <div className="lightbox-actions">
                <button className="action-btn share-btn" onClick={() => handleShare(stories[currentIndex])}>
                  <FaShareAlt /> Share Story
                </button>
                <button className="action-btn expand-btn">
                  <FaExpand /> View Full Size
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="gallery-footer">
        <p>
          Each image tells a story of love, trust, and lifelong commitment. 
          These moments are forever cherished.
        </p>
        <div className="footer-stats">
          <div className="footer-stat">
            <FaHeart />
            <span>{stories.length} Happy Couples</span>
          </div>
          <div className="footer-stat">
            <FaImage />
            <span>Verified Stories</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;