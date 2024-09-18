import React from 'react';
import kaylaImg from '../assets/images/kayla-maa.jpg';

const KaylaMaa = () => {
  return (
    <div className="team-member" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      {/* Image on Top */}
      <img
        src={kaylaImg}  // Use the imported image
        alt="Kayla Maa"
        style={{ width: '200px', height: 'auto', marginBottom: '20px' }} // Image at the top with some margin
      />
      
      {/* Bio Section */}
      <h1>Kayla Maa</h1>
      <h2>Front-End Lead</h2>
      <p>Kayla leads the front-end development, focusing on delivering a user-friendly interface for the application.</p>
      <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
      Hello, I’m currently a senior at SF State, majoring in Computer Science. Outside of school, I enjoy exploring new places and being outdoors alongside my boyfriend!
      </p>

      {/* Project Study Plan Section */}
      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <h3>Project Study Plan</h3>
        <ul>
          <li><strong>Week 1:</strong> Node.js, Express Basics</li>
          <li><strong>Week 2:</strong> MySQL Database Setup</li>
          <li><strong>Week 3:</strong> Authentication (JWT, Bcrypt)</li>
          <li><strong>Week 4:</strong> API Development and Testing</li>
          <li><strong>Week 5:</strong> Text Similarity Analysis</li>
        </ul>
      </div>
    </div>
  );
};

export default KaylaMaa;
