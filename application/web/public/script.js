document.addEventListener('DOMContentLoaded', async () => {
  const logoutButton = document.getElementById('logout-btn');
  const signupButton = document.getElementById('signup-btn');
  const loginButton = document.getElementById('login-btn');
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');
  const gameGrid = document.getElementById('gameGrid');

  // Login logic
  const loginForm = document.querySelector('.login-form');
  if (loginForm && loginForm.id !== 'signup-form') {
    loginForm.addEventListener('submit', async event => {
      event.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });

        console.log('Login response:', response);

        if (response.ok) {
          const data = await response.json();
          console.log('Login successful, user:', data);
          alert(`Welcome, ${data.name}!`);
          window.location.href = 'index.html';
        } else {
          console.warn('Login failed. Check credentials or server response.');
          alert('Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Search functionality
  if (searchButton && searchInput && gameGrid) {
    searchButton.addEventListener('click', async () => {
      const searchTerm = searchInput.value;
      if (searchTerm) {
        try {
          const response = await fetch(
            `http://127.0.0.1:8000/api/games/search?query=${encodeURIComponent(searchTerm)}`,
            {
              credentials: 'include',
            }
          );

          if (!response.ok) throw new Error('Network response was not ok');

          const games = await response.json();
          console.log('Current data from the API: ', games);

          gameGrid.innerHTML = '';

          games.forEach(game => {
            const gameTile = document.createElement('div');
            gameTile.className = 'game-tile';

            // Create an image element for the game
            const gameImage = document.createElement('img');
            gameImage.src = game.cover_image; 
            gameImage.alt = game.title;
            gameTile.appendChild(gameImage);

            // Add the game title as text
            const gameTitle = document.createElement('p');
            gameTitle.textContent = game.title; // Add the game title as text
            gameTile.appendChild(gameTitle); // Append the title to the game tile

            // Make the game tile clickable and redirect to the gameinfo page
            gameTile.addEventListener('click', () => {
              window.location.href = `game-info.html?gameId=${game.game_id}`;
            });
            

            gameGrid.appendChild(gameTile);
          });
        } catch (error) {
          console.error('Error fetching games:', error);
        }
      } else {
        alert('Please enter a search term');
      }
    });
  }

  // Logout functionality
  if (logoutButton) {
    logoutButton.addEventListener('click', async event => {
      event.preventDefault();
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          console.log('Logout successful');
          alert('Successfully logged out');
          window.location.reload();
        } else {
          console.warn('Logout failed');
          alert('Logout failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Check authentication status and update UI
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/status', {
        method: 'GET',
        credentials: 'include',
      });

      console.log('Status check response:', response);
      const data = await response.json();
      console.log('Auth status data:', data);

      if (data.loggedIn) {
        console.log('User is logged in');
        logoutButton.style.display = 'inline-block';
        signupButton.style.display = 'none';
        loginButton.style.display = 'none';
      } else {
        console.log('User is not logged in');
        logoutButton.style.display = 'none';
        signupButton.style.display = 'inline-block';
        loginButton.style.display = 'inline-block';
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  // Call checkAuthStatus on page load
  await checkAuthStatus();
});

// Google login button functionality
const googleLoginButton = document.getElementById('google-login-button');
if (googleLoginButton) {
  googleLoginButton.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/api/auth/google';
  });
}

