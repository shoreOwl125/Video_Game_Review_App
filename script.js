// Select the search button, input field, rating filter, and game grid
const searchButton = document.querySelector('.search-button');
const searchInput = document.querySelector('.search-input');
const ratingFilter = document.getElementById('rating-filter');
const gameGrid = document.getElementById('gamegrid');

// Add an event listener to the search button
searchButton.addEventListener('click', async () => {
    const searchTerm = searchInput.value; // Get the input value
    const selectedRating = ratingFilter.value; // Get the selected rating

    // Check if the input is not empty
    if (searchTerm) {
        try {
            // Construct the search query with both search term and rating
            let query = `query=${encodeURIComponent(searchTerm)}`;
            if (selectedRating) {
                query += `&rating=${selectedRating}`; // Add rating filter if selected
            }

            // Make a fetch request to the backend
            const response = await fetch(`http://localhost:8000/api/games/search?${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const games = await response.json(); // Parse the JSON response

            // Clear the previous game tiles
            gameGrid.innerHTML = '';

            // Populate the grid with fetched games
            games.forEach(game => {
                const gameTile = document.createElement('div');
                gameTile.className = 'game-tile';
                gameTile.textContent = `${game.title} - Rating: ${game.rating}`; // Display game title and rating
                gameGrid.appendChild(gameTile);
            });
        } catch (error) {
            console.error('Error fetching games:', error);
        }
    } else {
        alert('Please enter a search term'); // Alert if input is empty
    }
});

