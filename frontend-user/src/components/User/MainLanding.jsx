import React, { useEffect } from "react";
import Home from "../../../public/Home";
import About from "./Pages/About";
import Testimonials from "./Pages/Testimonials";
import Stories from "./Pages/Stories";
import MainGallery from "./Pages/MainGallery";
import Contact from "./Pages/Contact";


const MainLanding = () => {
    return (
      <div className="landing-page">

        <section id="home" className="page-section">
          <Home />
        </section>
  
        <section id="about" className="page-section">
          <About />
        </section>
  
        <section id="story" className="page-section">
          <Stories />
        </section>
  
        <section id="testimonial" className="page-section">
          <Testimonials />
        </section>
  
        <section id="gallery" className="page-section">
          <MainGallery />
        </section>
  
        <section id="contact" className="page-section">
          <Contact />
        </section>
      </div>
    );
  };
  
  export const LoginPageWrapper = ({ children }) => {
    useEffect(() => {
      window.scrollTo(0, 0); // Force top
    }, []);
  
    return <div className="non-landing-page">{children}</div>;
  };
export default MainLanding;
