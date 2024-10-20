// src/components/SearchPage.js
import React, { useState } from "react";
import "./styles.css"; // Assuming CSS is placed in src folder

const SearchPage = () => {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState("");

  const handleSearch = () => {
    // Logic to handle searching for games (e.g., calling API)
    console.log("Search query: ", searchQuery);
    console.log("Selected rating: ", selectedRating);
    // Mock game fetching (replace with actual API call)
    setGames([ /* your game objects here */ ]);
  };

  return (
    <div>
      <header className="banner">
        <div className="banner-picture"></div>
        <div className="banner-content">
          <h1 className="title">Rate My Video Game</h1>
          <div className="buttons">
            <button className="pill-button">Sign Up</button>
            <button className="pill-button">Login</button>
          </div>
        </div>
      </header>

      <section className="content-section">
        <div className="search-bar">
          <div className="search-input-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for a video game"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="buttons">
          <label htmlFor="rating-filter">Filter By: </label>
          <select
            id="rating-filter"
            className="pill-dropdown"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
          >
            <option value="">Select Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>

        <div className="grid" id="gamegrid">
          {games.map((game, index) => (
            <div key={index} className="game-tile">
              <h3>{game.title}</h3>
              <p>{game.description}</p>
              <p>{game.rating} Stars</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SearchPage;
