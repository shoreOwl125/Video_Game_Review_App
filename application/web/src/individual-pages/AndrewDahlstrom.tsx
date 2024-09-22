import React from "react";
import andrewImage from "../assets/images/andrew-dahlstrom.JPG"; // Import the image

const AndrewDahlstrom: React.FC = () => {
  return (
    <div
      className="team-member"
      style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}
    >
      {/* Image on Top */}
      <img
        src={andrewImage} // Use the imported image
        alt="Andrew Dahlstrom"
        style={{ width: "200px", height: "auto", marginBottom: "20px" }} // Image at the top with some margin
      />

      {/* Bio Section */}
      <h1>Andrew Dahlstrom</h1>
      <h2>Product Owner</h2>
      <p>Andrew is the product owner and oversees the product lifecycle.</p>
      <p style={{ textAlign: "justify", lineHeight: "1.6" }}>
        I am an M.Sc. Computer Science candidate at San Francisco State
        University, specializing in Data Science and AI, with a passion for
        applying machine learning and AI to solve complex problems. My
        experience spans AI model development, cloud computing, and
        collaborative tools like GitHub, and I’ve worked on projects through
        NSF's I-Corps Program and the DOE’s Omni Program. I’m skilled in data
        engineering, cloud deployment, and using frameworks like TensorFlow and
        PyTorch. Outside of my academic and research interests, I enjoy hiking
        around Bay Area parks and exploring new restaurants.
      </p>

      {/* Project Study Plan Section */}
      <div style={{ marginTop: "40px", textAlign: "left" }}>
        <h3>Project Study Plan</h3>
        <ul>
          <li>
            <strong>Week 1:</strong> Node.js, Express Basics
          </li>
          <li>
            <strong>Week 2:</strong> MySQL Database Setup
          </li>
          <li>
            <strong>Week 3:</strong> Authentication (JWT, Bcrypt)
          </li>
          <li>
            <strong>Week 4:</strong> API Development and Testing
          </li>
          <li>
            <strong>Week 5:</strong> Text Similarity Analysis
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AndrewDahlstrom;
