document.addEventListener('DOMContentLoaded', async () => {
    // Assuming you passed the game ID in the URL for the game info page
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    const gameImageElement = document.querySelector('.game-image img'); // Selects the image in the .game-image container
  
    if (gameId && gameImageElement) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/games/${gameId}`);
        
        if (response.ok) {
          const gameData = await response.json();
          console.log('Game data received:', gameData);
  
          // Use the game's cover image URL from the API response
          gameImageElement.src = gameData.cover_image;  // This sets the image source to the cover image URL
  
          // You can add additional logic here to populate other parts of the game info page.
        } else {
          console.error('Failed to fetch game data');
        }
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    }
  });
  