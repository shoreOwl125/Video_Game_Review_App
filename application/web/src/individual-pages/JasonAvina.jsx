import React from 'react';
import jasonImage from '../assets/images/jason-avina.png'; // Import the image


const JasonAvina = () => {
  return (
    <div className="team-member">
      <h1>Jason Avina</h1>
      <h2>Scrum Master</h2>
      <p>Jason is one of the Scrum Masters, ensuring the smooth operation of the team’s processes and workflows.</p>
      <p>Hello, I am a graduate student in the Data Science and Artificial Intelligence program at SFSU.</p>
      <p>My other interests include stock trading, exploring SF and learning Mandarin.</p>
      <img
        src={jasonImage}  // Use the imported image
        alt="Andrew Dahlstrom"
        style={{ width: '200px', height: 'auto' }} // You can adjust size as needed
      />
      <ul>
          <li><strong>Week 1:</strong> Node.js, Express Basics</li>
          <li><strong>Week 2:</strong> MySQL Database Setup</li>
          <li><strong>Week 3:</strong> Authentication (JWT, Bcrypt)</li>
          <li><strong>Week 4:</strong> API Development and Testing</li>
          <li><strong>Week 5:</strong> Text Similarity Analysis</li>
        </ul>
    </div>
  );
};

export default JasonAvina;
