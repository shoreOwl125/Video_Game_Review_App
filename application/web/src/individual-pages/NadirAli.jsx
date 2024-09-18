import React from 'react';
import nadirAliImg from '../assets/images/NadirAli.JPG';

const NadirAli = () => {
  return (
    <div className="team-member">
      <h1>Nadir Ali</h1>
      <h2>Github Master</h2>
      <p>Nadir is responsible for managing the GitHub repository and ensuring version control best practices are followed.</p>
      <p>Hello everyone! My name is Nadir and I ama senior at San Franciso State University.
        In my freetime I like to play soccer and watch tv shows. Some of my favorite shows inlcude Breaking Bad and Game of Thrones
      </p>
      <img
        src={nadirAliImg}  // Use the imported image
        alt="Nadir Ali"
        style={{ width: '200px', height: 'auto' }} // You can adjust size as needed
      />
    </div>
  );
};

export default NadirAli;
