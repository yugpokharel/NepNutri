import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa"
import "./ContactUs.css"

const ContactUs = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Contact Us</h1>
        <p className="contact-description">
          Have questions or need assistance? We're here to help! Reach out to us using any of the methods below.
        </p>

        <div className="contact-info">
          <div className="contact-item">
            <FaPhone className="contact-icon" />
            <div>
              <h3>Phone</h3>
              <p>+977 9844076833</p>
            </div>
          </div>

          <div className="contact-item">
            <FaEnvelope className="contact-icon" />
            <div>
              <h3>Email</h3>
              <p>support@nepnutri.com</p>
            </div>
          </div>

          <div className="contact-item">
            <FaMapMarkerAlt className="contact-icon" />
            <div>
              <h3>Address</h3>
              <p>123 Nutrition Street, Kathmandu, Nepal</p>
            </div>
          </div>
        </div>

        <form className="contact-form">
          <h2>Send us a message</h2>
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  )
}

export default ContactUs

