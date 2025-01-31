import { useNavigate } from "react-router-dom"
import "./css/homepage.css"
import counter from "../../assets/counter.png"
import ProcessSection from "./ProcessSection"
import logo from "../../assets/logo.png"
import Footer from "./footer"
import PhilosophySection from "./Philosophy"
import BlurHeader from "../../blur-header"

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="galaxy-scroll">
      <BlurHeader>
        <div className="neo-homepage">
          <div className="cosmic-navbar">
            <div className="cosmic-logo" onClick={() => navigate("/homepage")}>
              <img src={logo || "/placeholder.svg"} alt="logo" className="logo-planet" />
            </div>
            <div className="nav-stellar-links">
              <span onClick={() => navigate("/about")} className="link-star">About</span>
              <span onClick={() => navigate("/process")} className="link-star">Process</span>
              <span onClick={() => navigate("/blog")} className="link-star">Blog</span>
              <span className="login-stardust" onClick={() => navigate("/login")}>
                Login
              </span>
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
        </div>
      </BlurHeader>

      <ProcessSection />
      <PhilosophySection />
      <Footer />
    </div>
  )
}

export default HomePage;
