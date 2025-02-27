import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./css/homepage.css";
import counter from "../../assets/ui.jpg";
import ProcessSection from "./ProcessSection";
import logo from "../../assets/logo.png";
import Footer from "./footer";
import PhilosophySection from "./Philosophy";

function HomePage() {
  const navigate = useNavigate();
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && window.scrollY > lastScrollY.current) {
        setIsNavbarVisible(false); // Hide navbar when scrolling down
      } else {
        setIsNavbarVisible(true); // Show navbar when scrolling up
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="galaxy-scroll">
      {/* Navbar with scroll effect */}
      <div className={`cosmic-navbar ${isNavbarVisible ? "visible" : "hidden"}`}>
        <div className="cosmic-logo" onClick={() => navigate("/homepage")}>
          <img src={logo || "/placeholder.svg"} alt="logo" className="logo-planet" />
        </div>
        <div className="nav-stellar-links">
          <span onClick={() => navigate("/about")} className="link-star">About</span>
          <span onClick={() => navigate("/process")} className="link-star">Process</span>
          <span onClick={() => navigate("/blog")} className="link-star">Blog</span>
          <span className="login-stardust" onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>

      <div className="nebula-container">
        <div className="galaxy-image">
          <img src={counter || "/placeholder.svg"} alt="counter" className="space-image" />
        </div>
        <div className="cosmic-text">
          <h2 className="subheading-galaxy">Transform Your Health with</h2>
          <h1 className="main-heading">NepNutri: Personalized Nutrition Coaching</h1>
          <p className="cosmic-description">
            Track your calories and reach your fitness goals with NepNutri. Our certified nutritionists are here to
            guide you throughout your journey of weight loss, weight gain, or simply maintaining a balanced and
            healthy lifestyle. Together, we'll help you achieve sustainable results and create habits that last a
            lifetime.
          </p>
          <button className="galactic-button" onClick={() => navigate("/login")}>
            Get Started Today →
          </button>
        </div>
      </div>

      <ProcessSection />
      <PhilosophySection />
      <Footer />
    </div>
  );
}

export default HomePage;