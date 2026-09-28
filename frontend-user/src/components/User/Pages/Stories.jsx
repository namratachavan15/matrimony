// import React, { useEffect } from "react";
// import { useStoryContext } from "../State/StoryContext";
// import "./Stories.css";

// const Stories = () => {
//   const { stories, fetchStories, loading } = useStoryContext();

//   useEffect(() => {
//     fetchStories(); 
//   }, []);

//   if (loading) {
//     return <div className="text-center mt-5">Loading stories...</div>;
//   }

//   return (
//     <div className="container mt-1 mb-2">
//       <h2 className="text-center story-title">Success Stories</h2>
//       <p className="text-center story-subtitle">
//         Real couples. Real happiness. Real stories.
//       </p>

//       <div className="row mt-4">
//         {stories.length === 0 ? (
//           <p className="text-center">No stories available</p>
//         ) : (
//           stories.map((story) => (
//             <div className="col-md-4 mb-4" key={story.id}>
//               <div className="story-card">
//                 <img
//                   src={`http://localhost:5454/uploads/stories/${story.simg}`}
//                   alt="Wedding"
//                   className="story-img"
//                 />

//                 <div className="story-body">
//                   <h5 className="story-names">
//                     {story.bridename} ❤️ {story.groomname}
//                   </h5>

//                   <p className="story-date">
//                     📅 {story.marriageDate}
//                   </p>

                 
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Stories;


import React, { useEffect } from "react";
import { useStoryContext } from "../State/StoryContext";
import "./Stories.css";
import { FaHeart, FaCalendarAlt, FaQuoteLeft, FaStar } from "react-icons/fa";

const Stories = () => {
  const { stories, fetchStories, loading } = useStoryContext();

  useEffect(() => {
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading beautiful stories...</p>
      </div>
    );
  }

  return (
    <section className="stories-section" id="story">
      {/* Header Section */}
      <div className="stories-header">
        <div className="container">
          <div className="header-content">
            <h6 className="section-subtitle">Real Life Journeys</h6>
            <h1 className="section-title">
              Success <span className="highlight">Stories</span>
            </h1>
            <div className="divider"></div>
            <p className="section-description">
              Witness the beautiful beginnings of couples who found their perfect match through us.
              Each story is a testament to love, trust, and lifelong commitment.
            </p>
          </div>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="container">
        {stories.length === 0 ? (
          <div className="no-stories">
            <div className="empty-state">
              <FaHeart className="empty-icon" />
              <h3>No stories yet</h3>
              <p>Be the first to share your beautiful journey!</p>
            </div>
          </div>
        ) : (
          <div className="stories-grid">
            {stories.map((story, index) => (
              <div className="story-card-wrapper" key={story.id}>
                <div 
                  className="story-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Container */}
                  <div className="story-image-container">
                    <img
                      src={`http://localhost:5454/uploads/stories/${story.simg}`}
                      alt={`${story.bridename} & ${story.groomname}`}
                      className="story-image"
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <div className="heart-badge">
                        <FaHeart  className="heart-icon"/>
                      </div>
                    </div>
                    <div className="corner-ribbon">Success Story</div>
                  </div>

                  {/* Card Content */}
                  <div className="story-content">
                    {/* Couple Names */}
                    <div className="couple-names">
                      <h3>
                        <span className="groom">{story.groomname}</span>
                        <span className="heart-icon"><FaHeart className="heart-icon"/></span>
                        <span className="bride">{story.bridename}</span>
                      </h3>
                    </div>

                    {/* Wedding Date */}
                    <div className="wedding-date">
                      <FaCalendarAlt className="date-icon" />
                      <span style={{  color:" #9c5470"}}>{new Date(story.marriageDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>

                    {/* Story Excerpt (if available) */}
                    {story.story && (
                      <div className="story-excerpt">
                        <FaQuoteLeft className="quote-icon" />
                        <p>{story.story.length > 120 ? `${story.story.substring(0, 120)}...` : story.story}</p>
                      </div>
                    )}

                    {/* Read More Link */}
                   

                    {/* Rating Stars (Optional) */}
                   
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

   
    </section>
  );
};

export default Stories;