// import React, { useEffect } from "react";
// import { useStoryContext } from "../State/StoryContext";
// import "./MainGallery.css";

// const MainGallery = () => {
//   const { stories, fetchStories, loading } = useStoryContext();

//   useEffect(() => {
//     fetchStories();
//   }, []);

//   if (loading) {
//     return <div className="text-center mt-5">Loading Gallery...</div>;
//   }

//   return (
//     <div className="main-gallery-container">
     

//       <div className="gallery-grid">
//         {stories.length === 0 ? (
//           <p className="text-center">No success stories available</p>
//         ) : (
//           stories
//             .filter((story) => story.status === 1) // ✅ ONLY ACTIVE STORIES
//             .map((story) => (
//               <div className="gallery-card" key={story.id}>
//                 <img
//                   src={`http://localhost:5454/uploads/stories/${story.simg}`}
//                   alt={`${story.bridename} & ${story.groomname}`}
//                   className="gallery-image"
//                 />

//                 <div className="gallery-overlay">
//                   <h4>
//                     {story.bridename} ❤️ {story.groomname}
//                   </h4>
//                   <p>{story.marriageDate}</p>
//                 </div>
//               </div>
//             ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainGallery;

import React, { useEffect, useState } from "react";
import { useStoryContext } from "../State/StoryContext";
import "./MainGallery.css";
import { 
  FaHeart, 
  FaSearchPlus, 
  FaCalendarAlt, 
  FaTimes,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";

const MainGallery = () => {
  const { stories, fetchStories, loading } = useStoryContext();
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (stories.length > 0) {
      const activeStories = stories.filter((story) => story.status === 1);
      setFilteredStories(activeStories);
    }
  }, [stories]);

  const openLightbox = (story, index) => {
    setSelectedImage(story);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === filteredStories.length - 1 ? 0 : prevIndex + 1
    );
    setSelectedImage(filteredStories[currentIndex + 1] || filteredStories[0]);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? filteredStories.length - 1 : prevIndex - 1
    );
    setSelectedImage(filteredStories[currentIndex - 1] || filteredStories[filteredStories.length - 1]);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading beautiful moments...</p>
      </div>
    );
  }

  return (
    <>
      <section className="gallery-section" id="gallery">
        {/* Background Elements */}
        <div className="gallery-bg-pattern"></div>
        
        {/* Section Header */}
        <div className="gallery-header">
          <div className="container">
            <h6 className="gallery-subtitle">Memories Gallery</h6>
            <h1 className="gallery-title">
              Moments of <span className="highlight">Joy</span>
            </h1>
            <div className="divider"></div>
            <p className="gallery-description">
              Celebrating beautiful beginnings and lifelong commitments. 
              Each image tells a story of love, trust, and happiness.
            </p>
            
            {/* Gallery Stats */}
            {/* <div className="gallery-stats">
              <div className="stat-item">
                <span className="stat-number">{filteredStories.length}</span>
                <span className="stat-label">Success Stories</span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Verified</span>
              </div>
              <div className="stat-divider">|</div>
              <div className="stat-item">
                <span className="stat-number">❤️</span>
                <span className="stat-label">Happy Couples</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="container">
          {filteredStories.length === 0 ? (
            <div className="no-gallery">
              <div className="empty-state">
                <FaHeart className="empty-icon" />
                <h3>Gallery is empty</h3>
                <p>Beautiful moments coming soon...</p>
              </div>
            </div>
          ) : (
            <div className="gallery-grid">
              {filteredStories.map((story, index) => (
                <div 
                  className="gallery-item" 
                  key={story.id}
                  onClick={() => openLightbox(story, index)}
                >
                  <div className="image-container">
                    <img
                      src={`http://localhost:5454/uploads/stories/${story.simg}`}
                      alt={`${story.bridename} & ${story.groomname}`}
                      className="gallery-img"
                      loading="lazy"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <FaSearchPlus className="zoom-icon" />
                        <div className="couple-info">
                          <h4>
                            {story.bridename} <FaHeart className="heart-icon" /> {story.groomname}
                          </h4>
                          <p className="wedding-date">
                            <FaCalendarAlt /> {story.marriageDate}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Love Badge */}
                    <div className="love-badge">
                      <FaHeart />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="lightbox">
          <div className="lightbox-overlay" onClick={closeLightbox}></div>
          
          <div className="lightbox-content">
            {/* Close Button */}
            <button className="lightbox-close" onClick={closeLightbox}>
              <FaTimes />
            </button>

            {/* Navigation Arrows */}
            <button className="lightbox-nav prev" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            <button className="lightbox-nav next" onClick={nextImage}>
              <FaChevronRight />
            </button>

            {/* Image */}
            <div className="lightbox-image-container">
              <img
                src={`http://localhost:5454/uploads/stories/${selectedImage.simg}`}
                alt={`${selectedImage.bridename} & ${selectedImage.groomname}`}
                className="lightbox-img"
              />
            </div>

            {/* Image Info */}
            <div className="lightbox-info">
              <h3>
                {selectedImage.bridename} 
                <span className="heart-separator">❤️</span> 
                {selectedImage.groomname}
              </h3>
              <p className="wedding-info">
                <FaCalendarAlt /> Wedding Date: {selectedImage.marriageDate}
              </p>
              <div className="image-counter">
                {currentIndex + 1} / {filteredStories.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MainGallery;