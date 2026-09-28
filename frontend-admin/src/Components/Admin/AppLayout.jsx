// AppLayout.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import "./AppLayout.css";

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);   // desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile slide

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 1024) {
      // MOBILE: open/close sidebar
      setIsMobileOpen((prev) => !prev);
    } else {
      // DESKTOP: collapse/expand width
      setIsCollapsed((prev) => !prev);
    }
  };

  // Close mobile sidebar when resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className={`app-wrapper admin-premium-shell ${isCollapsed ? "collapsed" : ""}`}>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <Header toggleSidebar={handleToggleSidebar} />

      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
 
export default AppLayout;