import React from "react";
import RyanImage from "../assets/images/RyanFlanneryI.jpg"; // Import my image

const RyanFlannery = () => {
  return (
    <div className="team-member">
      <h1>Ryan Flannery</h1>
      <h2>Back-end Lead</h2>
      <p>
        Ryan leads the back-end development, ensuring server-side functionality
        and data management are seamless.
      </p>
      <p>
        Hey everyone, my name is Ryan and I am a senior at SFSU majoring in
        Computer Science with a minor in Computing Applications. My favorite
        things to do include going to the gym and playing sports, spending time
        with family, and developing video games in my free time.
      </p>
      <img
        src={RyanImage} // Use imported image
        alt="Ryan Flannery"
        style={{ width: "200px", height: "auto" }}
      />
    </div>
  );
};

export default RyanFlannery;
