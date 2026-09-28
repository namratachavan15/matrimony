// Footer.jsx
import "./Footer.css";
import { FaHeart, FaCopyright } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mm-footer">
      <div className="footer-content">
        <div className="footer-text">
          <FaCopyright className="footer-icon" />
          <span>{currentYear} Maratha Matrimony</span>
        </div>
        <div className="footer-message">
          Made with <FaHeart className="heart-icon" /> for our community
        </div>
      </div>
    </footer>
  );
}