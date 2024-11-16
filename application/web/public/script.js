let userId = null; // Global variable to store the logged-in user's ID

document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const logoutButton = document.getElementById('logout-btn');
  const signupButton = document.querySelector('a[href="signup.html"]');
  const loginButton = document.querySelector('a[href="login.html"]');
  const settingsButton = document.getElementById('settings-btn');
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');
  const gameGrid = document.getElementById('gameGrid');
  const recommendationButton = document.getElementById('recommendation-button');
  const googleLoginButton = document.getElementById('google-login-button');
  

  // Check Authentication Status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/status', {
        method: 'GET',
        credentials: 'include',
      });
  
      const data = await response.json();
  
      if (data.loggedIn) {
        if(data.userId){
          userId = data.userId;
        }
        console.log(`User is logged in. User ID: ${userId}`);

        // Show/Hide elements based on their existence
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (signupButton) signupButton.style.display = 'none';
        if (loginButton) loginButton.style.display = 'none';
        if (settingsButton) settingsButton.style.display = 'inline-block';
      } else {
        console.log('User is not logged in');
  
        // Show/Hide elements based on their existence
        if (logoutButton) logoutButton.style.display = 'none';
        if (settingsButton) settingsButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'inline-block';
        if (loginButton) loginButton.style.display = 'inline-block';
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  // Login Logic
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

        if (response.ok) {
          const data = await response.json();
          userId = data.id; // Store user ID from login response
          console.log('User ID stored after login:', userId);
          alert(`Welcome, ${data.name}!`);
          window.location.href = 'index.html';
        } else {
          alert('Login failed. Please check your credentials.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Signup Logic
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
          window.location.href = 'login.html'; // Redirect to login page
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

  // Logout Functionality
  if (logoutButton) {
    logoutButton.addEventListener('click', async event => {
      event.preventDefault();
      try {
        const response = await fetch('http://127.0.0.1:8000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          alert('Successfully logged out');
          window.location.href = 'index.html'; // Reload to the home page
        } else {
          alert('Logout failed. Please try again.');
        }
      } catch (error) {
        console.error('Error during logout:', error);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Fetch Recommendations
  if (recommendationButton) {
    recommendationButton.addEventListener('click', async () => {
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

  // Search Functionality
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

  // Google Login
  if (googleLoginButton) {
    googleLoginButton.addEventListener('click', () => {
      window.location.href = 'http://127.0.0.1:8000/api/auth/google';
    });
  }

  // Update Profile Information/Settings
  const updateProfileInformation = async () => {
    const currentPath = window.location.pathname.split('/').pop();
    if (currentPath !== 'view-profile.html') return;

    if (!userId) {
      console.error('User ID is not available. Cannot fetch profile information.');
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const user = await response.json();
        document.getElementById('username').textContent = user.name;
        document.getElementById('user-username').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;
        document.getElementById('user-member-since').textContent = new Date(
          user.created_at
        ).toLocaleDateString();
      } else {
        console.error('Failed to fetch user profile information');
      }
    } catch (error) {
      console.error('Error fetching user profile information:', error);
    }
  };

  // Initialize on Page Load
  await checkAuthStatus();
  await updateProfileInformation();
});

// Profile picture upload does not save to user db yet
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