import "./css/Philosophy.css"
import dietitianImage from "../../assets/dietitian.jpeg"
import healthyMeal from "../../assets/healthy-meal.jpg"
import workout from "../../assets/workout.jpg"

function PhilosophySection() {
  return (
    <section className="philosophy-section">
      <div className="philosophy-container">
        <div className="philosophy-grid">
          <div className="image-left">
            <img
              src={workout || "/placeholder.svg?height=200&width=200"}
              alt="Workout session"
              className="side-image"
            />
          </div>

          <div className="image-center">
            <img
              src={dietitianImage || "/placeholder.svg?height=300&width=300"}
              alt="Quandle Dingle profile"
              className="profile-qd"
            />
            <div className="profile-text">
              <h3>Quandle Dingle</h3>
              <p>NepNutri Registered Dietitian</p>
            </div>
          </div>

          <div className="image-right">
            <img
              src={healthyMeal || "/placeholder.svg?height=200&width=200"}
              alt="Healthy meal plate"
              className="side-image"
            />
          </div>
        </div>

        <div className="philosophy-content">
          <h2>Our Philosophy</h2>
          <h1>Empowerment through Nutrition</h1>
          <p>
            At NepNutri, we believe that knowledge is the cornerstone of a healthier life. Tracking your meals and
            understanding your nutritional needs can transform the way you approach health and wellness.
          </p>
          <p>
            Our platform is designed to simplify calorie and nutrition tracking, offering personalized insights and
            actionable data to guide your journey.
          </p>
          <p>
            Healthy living is not a destination but a lifelong adventure. With every meal tracked and every choice made,
            you'll get the confidence and clarity to create a sustainable lifestyle that aligns with your goals and
            values.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection

