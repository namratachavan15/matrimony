// import React, { useEffect } from "react";
// import { useTestimonialContext } from "../State/TestimonialContext";
// import "./Testimonials.css";

// const Testimonials = () => {
//   const { testimonials, fetchTestimonials, loading } = useTestimonialContext();

//   useEffect(() => {
//     fetchTestimonials(); // ✅ Load from context
//   }, []);

//   if (loading) {
//     return <div className="text-center mt-2">Loading testimonials...</div>;
//   }

//   return (
//     <div className="container mt-5 mb-1" style={{height:'900px'}}>
//       <h2 className="text-center testimonial-title">What Our Clients Say</h2>
//       <p className="text-center testimonial-subtitle">
//         Real experiences from happy couples and families
//       </p>

//       <div className="row mt-4">
//         {testimonials.length === 0 ? (
//           <p className="text-center">No testimonials available</p>
//         ) : (
//           testimonials.map((item) => (
//             <div className="col-md-4 mb-4" key={item.id}>
//               <div className="testimonial-card">
                
//                 <img
//                   src={`http://localhost:5454/uploads/testimonials/${item.simg}`}
//                   alt={item.name}
//                   className="testimonial-img"
//                 />

//                 <div className="testimonial-body">
//                   <h5 className="testimonial-name">{item.name}</h5>

//                   <p className="testimonial-text">
//                     “{item.testimonial}”
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

// export default Testimonials;



import React, { useEffect, useState } from "react";

import "./Testimonials.css";
import { FaQuoteLeft, FaQuoteRight, FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTestimonialContext } from "../State/TestimonialContext";

const Testimonials = () => {
  const { testimonials, fetchTestimonials, loading } = useTestimonialContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const nextSlide = () => {
    setAnimate(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
      setAnimate(true);
    }, 300);
  };

  const prevSlide = () => {
    setAnimate(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setAnimate(true);
    }, 300);
  };

  if (loading) {
    return (
      <div className="testimonials-loading">
        <div className="loading-spinner"></div>
        <p>Loading heartfelt stories...</p>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="no-testimonials">
        <div className="empty-state">
          <FaQuoteLeft className="empty-icon" />
          <h3>No testimonials yet</h3>
          <p>Be the first to share your experience!</p>
        </div>
      </div>
    );
  }

  return (
    <section className="testimonials-section" id="testimonial">
      {/* Background Decoration */}
      <div className="bg-pattern"></div>
      
      <div className="container">
        {/* Section Header */}
        <div className="testimonials-header">
          <h6 className="section-subtitle">Client Love</h6>
          <h2 className="section-title">
            Voices of <span className="highlight">Happiness</span>
          </h2>
          <div className="divider"></div>
          <p className="section-description">
            Hear from couples and families who found their perfect match through our service.
            Every story is a journey of trust and lasting relationships.
          </p>
        </div>

        {/* Featured Testimonial (Carousel Style) */}
        <div className="featured-testimonial">
          <div className={`testimonial-slide ${animate ? 'animate-in' : 'animate-out'}`}>
            <div className="slide-content">
              {/* Quote Icon */}
              <div className="quote-decoration">
                <FaQuoteLeft className="quote-left" />
                <FaQuoteRight className="quote-right" />
              </div>

              {/* Image */}
              <div className="client-image-container">
                <img
                  src={`http://localhost:5454/uploads/testimonials/${testimonials[currentIndex].simg}`}
                  alt={testimonials[currentIndex].name}
                  className="client-image"
                />
                <div className="image-frame"></div>
              </div>

              {/* Content */}
              <div className="testimonial-content">
                <div className="testimonial-text-wrapper">
                  <p className="testimonial-text">
                    "{testimonials[currentIndex].testimonial}"
                  </p>
                </div>

                <div className="client-info">
                  <h4 className="client-name">{testimonials[currentIndex].name}</h4>
                  <div className="client-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button className="nav-btn prev-btn" onClick={prevSlide}>
            <FaChevronLeft />
          </button>
          <button className="nav-btn next-btn" onClick={nextSlide}>
            <FaChevronRight />
          </button>

          {/* Dots Indicator */}
          <div className="dots-indicator">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.slice(0, 6).map((item, index) => (
            <div className="testimonial-card" key={item.id}>
              {/* Card Header */}
              <div className="card-header">
                <div className="client-avatar">
                  <img
                    src={`http://localhost:5454/uploads/testimonials/${item.simg}`}
                    alt={item.name}
                  />
                </div>
                <div className="client-details">
                  <h5 className="client-name-small">{item.name}</h5>
                  <div className="rating-small">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="star-small" />
                    ))}
                  </div>
                </div>
                <FaQuoteLeft className="card-quote" />
              </div>

              {/* Card Body */}
              <div className="card-body">
                <p className="testimonial-excerpt">
                  {item.testimonial.length > 150 
                    ? `${item.testimonial.substring(0, 150)}...` 
                    : item.testimonial}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="testimonial-stats">
          <div className="stat-item">
            <h3 className="stat-number">1000+</h3>
            <p className="stat-label">Happy Couples</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">98%</h3>
            <p className="stat-label">Success Rate</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">4.9</h3>
            <p className="stat-label">Average Rating</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">10+</h3>
            <p className="stat-label">Years Experience</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;