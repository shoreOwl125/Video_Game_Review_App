import React from "react";
import { Link } from "react-router-dom";
import './AboutUs.css'; // Assuming you will create some custom CSS here
import studentImage from './assets/images/placeholder.jpg'; 

const AboutUs = () => {
  const teamMembers = [
    { name: "Jason Avina", role: "Scrum Master", link: "/team/jason-avina" },
    { name: "Joyce Fu", role: "Scrum Master", link: "/team/joyce-fu" },
    { name: "Nadir Ali", role: "Github Master", link: "/team/nadir-ali" },
    { name: "Kayla Maa", role: "Front-end Lead", link: "/team/kayla-maa" },
    { name: "Aidan Bayer-Calvert", role: "Back-end Lead", link: "/team/aidan-bayer-calvert" },
    { name: "Ryan Flannery", role: "Back-end Lead", link: "/team/ryan-flannery" },
    { name: "Andrew Dahlstrom", role: "Product Owner", link: "/team/andrew-dahlstrom" }
  ];

  return (
    <div className="about-us">
      <h1>About Us</h1>
      
      {/* Intro Section */}
      <p className="intro">
        Welcome to our project! We are a group of 7 dedicated team members
        working to create an amazing web application that helps users review 
        and find their favorite games.
      </p>

      {/* Placeholder Image Section */}
      <div className="placeholder-image">
        <img
          src={studentImage}
          alt="Placeholder"
          className="image-placeholder"
          style={{ width: '400px', height: 'auto', marginBottom: '20px' }} // Image at the top
        />
      </div>

      {/* Team Members Section */}
      <h2>Meet Our Team</h2>
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <h3>{member.name}</h3>
            <p>{member.role}</p>
            <Link to={member.link} className="team-link">
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {/* Meeting and Study Schedule Section */}
      <div className="meeting-info" style={{ marginTop: '40px' }}>
        <p><b>Meeting Times: </b>Monday after class and Wednesday 8pm</p>
        <p><b>Meeting Channel: </b>Discord</p>
        <p><a href="https://docs.google.com/document/d/1KCSDD8qNFlS1uTHWu4Y3orfyIT6Mm_eD91IicC1Htqw/edit?usp=sharing" 
          target="_blank">View the Team Skills and Study Schedule</a></p>
      </div>
    </div>
  );
};

export default AboutUs;
