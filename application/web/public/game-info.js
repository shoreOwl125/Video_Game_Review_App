document.addEventListener('DOMContentLoaded', async () => {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    const gameImageElement = document.querySelector('.game-image img'); // Selects the image in the .game-image container
    const gameTitleElement = document.querySelector('.game-stats .title'); // Select the game title element (if you want to display it)
    const gameRatingElement = document.querySelector('.game-stats .rating'); // Select the rating element
    const gameReviewsElement = document.querySelector('.game-stats .reviews'); // Select the reviews element
    
    if (gameId && gameImageElement) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/games/${gameId}`);
        
        if (response.ok) {
          const gameData = await response.json();
          console.log('Game data received:', gameData);
  
          // Use the game's cover image URL from the API response
          gameImageElement.src = gameData.cover_image;  // This sets the image source to the cover image URL
          gameImageElement.alt = gameData.title;        // This sets the alt text for the image
  
          // Add the game title to the page
          if (gameTitleElement) {
            gameTitleElement.textContent = gameData.title;  // Set the title text
          }
  
          // Add the game's rating to the page
          if (gameRatingElement) {
            gameRatingElement.textContent = `Rating: ${gameData.review_rating} ★`;  // Display the rating
          }
  
          // Add the review count to the page
          if (gameReviewsElement) {
            gameReviewsElement.textContent = `Reviews: ${gameData.review_count || 'N/A'}`;  // Display the review count (or 'N/A' if missing)
          }
  
        } else {
          console.error('Failed to fetch game data');
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    } else {
      console.error('Game ID or game image element not found');
    }
  });
  