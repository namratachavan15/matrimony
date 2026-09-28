import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return (
      <div className="hero-wrapper">
      <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">

      {/* Indicators */}
      <div className="carousel-indicators">
        <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="0" className="active"></button>
        <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#homeCarousel" data-bs-slide-to="2"></button>
      </div>

      {/* Slides */}
      <div className="carousel-inner">

        <div className="carousel-item active">
          <img src="/Images/marriage1.jpg" className="d-block w-100 hero-img" alt="Slide 1" />
          <div className="hero-scrim"></div>
        </div>

        <div className="carousel-item">
          <img src="/Images/marriage2.jpg" className="d-block w-100 hero-img" alt="Slide 2" />
          <div className="hero-scrim"></div>
        </div>

        <div className="carousel-item">
          <img src="/Images/marriage3.jpg" className="d-block w-100 hero-img" alt="Slide 3" />
          <div className="hero-scrim"></div>
        </div>

      </div>

      {/* Static premium hero content overlaid on every slide */}
      <div className="hero-content">
        <span className="hero-eyebrow">Trusted Maratha Matrimony Platform</span>
        <h1 className="hero-title">
          Where Two Families<br /> Begin a Lifelong Bond
        </h1>
        <p className="hero-subtitle">
          Verified profiles, genuine intentions, and a service built on trust —
          helping you find a life partner with dignity and care.
        </p>
        <div className="hero-cta-row">
          <Link to="/register" className="btn-hero btn-hero-primary">
            Create Profile
          </Link>
          <Link to="/login" className="btn-hero btn-hero-secondary">
            Find Your Match
          </Link>
        </div>

        <div className="hero-trust-strip">
          <div className="hero-trust-item">
            <span className="hero-trust-number">10,000+</span>
            <span className="hero-trust-label">Verified Profiles</span>
          </div>
          <div className="hero-trust-divider"></div>
          <div className="hero-trust-item">
            <span className="hero-trust-number">1,000+</span>
            <span className="hero-trust-label">Successful Matches</span>
          </div>
          <div className="hero-trust-divider"></div>
          <div className="hero-trust-item">
            <span className="hero-trust-number">100%</span>
            <span className="hero-trust-label">Privacy Protected</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button className="carousel-control-prev" type="button" data-bs-target="#homeCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button className="carousel-control-next" type="button" data-bs-target="#homeCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
    </div>
  );
};



  export default Home;
  