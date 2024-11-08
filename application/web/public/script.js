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

  // Signup logic
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async event => {
      event.preventDefault();

      const name = signupForm.username.value;
      const email = signupForm.email.value;
      const password = signupForm.password.value;
      const confirmPassword = signupForm.confirm_password.value;

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/auth/register',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
          }
        );

        if (response.ok) {
          alert('Account created successfully! You can now log in.');
          window.location.href = 'login.html';
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error registering:', error);
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

  // Fetch recommendations
  const recommendationButton = document.getElementById('recommendation-button');
  if (recommendationButton) {
    recommendationButton.addEventListener('click', async () => {
      console.log('Fetching recommendations...');
      const recommendationsDiv = document.getElementById('recommendations');
      recommendationsDiv.innerHTML = '';

      try {
        const response = await fetch(
          'http://127.0.0.1:8000/api/userdata/2/recommendations',
          {
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        if (Array.isArray(data.recommendations)) {
          data.recommendations.forEach(game => {
            const gameContainer = document.createElement('div');
            for (const [key, value] of Object.entries(game)) {
              const pTag = document.createElement('p');
              pTag.textContent = `${key}: ${value}`;
              gameContainer.appendChild(pTag);
            }
            recommendationsDiv.appendChild(gameContainer);
            recommendationsDiv.appendChild(document.createElement('hr'));
          });
        } else {
          throw new Error('Expected an array of games in data.recommendations');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        recommendationsDiv.innerHTML = `<p>Error fetching recommendations. Please try again later.</p>`;
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
            `http://127.0.0.1:8000/api/games/search?query=${encodeURIComponent(
              searchTerm
            )}`,
            {
              credentials: 'include',
            }
          );

          if (!response.ok) throw new Error('Network response was not ok');

          const games = await response.json();
          gameGrid.innerHTML = '';
          games.forEach(game => {
            const gameTile = document.createElement('div');
            gameTile.className = 'game-tile';
            gameTile.textContent = game.title;
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
});

// Google login button functionality
const googleLoginButton = document.getElementById('google-login-button');
if (googleLoginButton) {
  googleLoginButton.addEventListener('click', () => {
    window.location.href = 'http://127.0.0.1:8000/api/auth/google';
  });
}

document.addEventListener("DOMContentLoaded", function() {
  // Select the profile picture elements
  const profilePicUpload = document.getElementById('profilePicUpload');
  const profilePic = document.getElementById('profilePic');

  // Only add the event listener if the elements exist
  if (profilePicUpload && profilePic) {
      profilePicUpload.addEventListener('change', function(event) {
          console.log("File selected"); // Add this to verify event trigger
          const file = event.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = function(e) {
                  console.log("Image loaded"); // Add this to verify loading
                  profilePic.src = e.target.result; // Set the profile picture src to the uploaded image's data URL
              };
              reader.readAsDataURL(file);
          }
      });
  }
});
