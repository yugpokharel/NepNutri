import React from "react";
import "./css/footer.css"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png"

function Footer() {
  const navigate = useNavigate()
  return (
    <>
      <section className="about-section">
        <div className="about-container">
          <h2>About NepNutri</h2>
          <p>
            NepNutri is your ultimate companion for achieving your nutrition and fitness goals. Designed to inspire a
            healthier lifestyle, our platform helps countless users every year track their calories, plan their meals,
            and make informed choices. With a rich database of foods and tailored diet plans, NepNutri goes beyond being
            a simple calorie tracker — it's your guide to taking control of your health, backed by science and
            personalized support.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-container">
          {/* Logo Section */}
          <div className="footer-logo-section">
            <img src={logo || "/placeholder.svg"} alt="NepNutri Logo" className="footer-logo" />
            <button className="get-started-button" onClick={() => navigate("/login")}>
                Get Started Today →
              </button>
          </div>

          {/* Links Section */}
          <div className="footer-links">
            {/* Help & Support Column */}
            <div className="footer-column">
              <h3>Help & Support</h3>
              <ul>
                <li>
                  <a href="/contact">Contact us</a>
                </li>
                <li>
                  <a href="/privacy">Privacy</a>
                </li>
                <li>
                  <a href="/about">About</a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="footer-column">
              <h3>Resources</h3>
              <ul>
                <li>
                  <a href="/exercises">Exercises</a>
                </li>
                <li>
                  <a href="/tools">Tools</a>
                </li>
                <li>
                  <a href="/whats-new">What's New</a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="footer-column">
              <div className="social-links">
                <a href="https://facebook.com" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://twitter.com" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© 2025 NepNutri. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Footer

