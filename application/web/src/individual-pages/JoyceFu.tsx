import React from 'react';
import JoyceImg from '../assets/images/JoyceImage.jpeg';

const JoyceFu = () => {
  return (
    <div className="team-member" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      {/* Image on Top */}
      <img
        src={JoyceImg}  // Use the imported image
        alt="Joyce Fu"
        style={{ width: '200px', height: 'auto', marginBottom: '20px' }} // Image at the top with some margin
      />
      
      {/* Bio Section */}
      <h1>Joyce Fu</h1>
      <h2>Scrum Master</h2>
      <p>Joyce is a dedicated Scrum Master, facilitating meetings and improving team productivity.</p>
      <p style={{ textAlign: 'justify', lineHeight: '1.6' }}>
      Hello everyone, I'm Joyce from Taiwan. I'm currently a senior majoring in Computer Science at SFSU. In my leisure time, I enjoy going out with friends and indulging in delicious food because I find these activities very relaxing. During times of high stress, holidays provide me with some relaxation. I also love watching basketball, which might be a part of my desire to study abroad, as I've been a fan of the NBA since childhood. So, when I visited San Francisco, I made sure to attend a Warriors game. Last year, on my birthday, I even went to the Chase Center, fulfilling one of my lifelong dreams.      </p>

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

export default JoyceFu;
