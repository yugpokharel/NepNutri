import React from "react";
import "./css/comment.css";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

const Comment = () => {
    const navigate = useNavigate();
  
    return (
      <div className="navbar">
        <div className="logo" onClick={() => navigate("/homepage")}>
          <img src={logo || "/placeholder.svg"} alt="logo" className="logo-image" />
        </div>
        <div className="form-container">
          <div className="progress-bar">
            <div className="progress" style={{ width: "50%" }}></div>
          </div>
          <h2 className="comment-heading">We get it. A busy lifestyle can easily get in the way of reaching your goals.</h2>
          <p className="comment-description">
            Luckily, we know all about managing potential pitfalls along the way because we’ve helped millions of people reach their goals.
          </p>
          <div className="button-group">
            <button className="back-btn" onClick={() => navigate(-1)}>BACK</button>
            <button className="next-btn" onClick={() => navigate("/gender")}>NEXT</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Comment;
