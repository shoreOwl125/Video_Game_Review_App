let userId = null; // Global variable to store the logged-in user's ID

document.addEventListener('DOMContentLoaded', async () => {
  const logoutButton = document.getElementById('logout-btn');
  const signupButton = document.querySelector('a[href="signup.html"]');
  const loginButton = document.querySelector('a[href="login.html"]');
  const settingsButton = document.getElementById('settings-btn');
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');
  const gameGrid = document.getElementById('gameGrid');
  const recommendationButton = document.querySelector('.get-recommendations');
  const googleLoginButton = document.getElementById('google-login-button');

  try {
    const response = await fetch('http://127.0.0.1:8000/api/games/populate', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Failed to fetch populateGames');

    const games = await response.json();
    console.log('Top games based on highest reviews:', games);

    // Optionally render the games on your page
    const gameGrid = document.getElementById('gameGrid');
    if (gameGrid) {
      gameGrid.innerHTML = ''; // Clear existing grid content
      games.forEach(game => {
        const gameTile = document.createElement('div');
        gameTile.className = 'game-tile';
        gameTile.textContent = game.title;

        const gameImage = document.createElement('img');
        gameImage.src = game.cover_image || 'gameinfo_testimage.png';
        gameImage.alt = game.title;

        gameTile.appendChild(gameImage);

        gameTile.addEventListener('click', () => {
          window.location.href = `game-info.html?gameId=${game.game_id}`;
        });

        gameGrid.appendChild(gameTile);
      });
    }
  } catch (error) {
    console.error('Error fetching populateGames:', error);
  }

  // Check Authentication Status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/status', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await response.json();

      if (data.loggedIn) {
        if (data.userId) {
          userId = data.userId;
        }
        console.log(`User is logged in. User ID: ${userId}`);

        // Show/Hide elements based on their existence
        if (logoutButton) logoutButton.style.display = 'inline-block';
        if (signupButton) signupButton.style.display = 'none';
        if (loginButton) loginButton.style.display = 'none';
        if (settingsButton) settingsButton.style.display = 'inline-block';
        if (recommendationButton)
          recommendationButton.style.display = 'inline-block';
      } else {
        console.log('User is not logged in');

        // Show/Hide elements based on their existence
        if (logoutButton) logoutButton.style.display = 'none';
        if (settingsButton) settingsButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'inline-block';
        if (loginButton) loginButton.style.display = 'inline-block';
        if (recommendationButton) recommendationButton.style.display = 'none';
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
      const profile_pic = 'application/web/public/Default-Profile-Picture.jpg';

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
            body: JSON.stringify({ name, email, profile_pic, password }),
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

  if (recommendationButton) {
    recommendationButton.addEventListener('click', async () => {
      const recommendationsDiv = document.getElementById('recommendations');
      recommendationsDiv.innerHTML = ''; // Clear previous recommendations

      if (!userId) {
        console.error(
          'User ID is not available. Cannot fetch recommendations.'
        );
        recommendationsDiv.innerHTML = `<p>Please log in to get recommendations.</p>`;
        return;
      }

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/userdata/${userId}/recommendations`,
          {
            credentials: 'include',
          }
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const recommendations = await response.json();
        console.log('Recommended Games:', recommendations);

        if (Array.isArray(recommendations) && recommendations.length > 0) {
          recommendations.forEach(game => {
            const gameTile = document.createElement('div');
            gameTile.className = 'game-tile';

            // Create game cover image element
            const gameImage = document.createElement('img');
            gameImage.src = game.cover_image || 'default-image.png'; // Fallback image if cover is missing
            gameImage.alt = game.title;

            // Create game title element
            const gameTitle = document.createElement('p');
            gameTitle.textContent = game.title;

            // Append elements to the game tile
            gameTile.appendChild(gameTitle);
            gameTile.appendChild(gameImage);

            // Add click event to navigate to game details
            gameTile.addEventListener('click', () => {
              window.location.href = `game-info.html?gameId=${game.game_id}`;
            });

            // Append the game tile to the recommendations div
            recommendationsDiv.appendChild(gameTile);
          });
        } else {
          recommendationsDiv.innerHTML = `<p>No recommendations available at this time.</p>`;
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        recommendationsDiv.innerHTML = `<p>Error fetching recommendations. Please try again later.</p>`;
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
      console.error(
        'User ID is not available. Cannot fetch profile information.'
      );
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );

      if (response.ok) {
        const user = await response.json();
        console.log(user.profile_pic);
        console.log('user created at ' + user);
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
  // Select the profile picture elements
  const profilePicUpload = document.getElementById('profilePicUpload');
  const profilePic = document.getElementById('profilePic');

  // Only add the event listener if the elements exist
  if (profilePicUpload && profilePic) {
    profilePicUpload.addEventListener('change', async function (event) {
      console.log('File selected'); // Log to verify event trigger
      const file = event.target.files[0];

      if (file) {
        // Display the preview
        const reader = new FileReader();
        reader.onload = function (e) {
          console.log('Image loaded'); // Log to verify loading
          profilePic.src = e.target.result; // Set the profile picture src to the uploaded image's data URL
        };
        reader.readAsDataURL(file);

        // Create FormData object to send the file to the server
        const formData = new FormData();
        formData.append('profilePicture', file);
        formData.append('userId', userId); // Assuming you have `userId` from the auth status

        try {
          // Send the image to your server
          const response = await fetch(
            'http://127.0.0.1:8000/api/users/upload-profile-picture',
            {
              method: 'POST',
              body: formData,
              credentials: 'include', // Include credentials if needed
            }
          );

          if (response.ok) {
            const data = await response.json();
            console.log('Profile picture uploaded successfully', data);
            alert('Profile picture uploaded successfully!');
          } else {
            console.error(
              'Error uploading profile picture:',
              response.statusText
            );
            alert('Failed to upload profile picture. Please try again.');
          }
        } catch (error) {
          console.error('Error uploading profile picture:', error);
          alert('An error occurred while uploading. Please try again.');
        }
      }
    });
  }

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

          const games = await response.json();
          if (!response.ok) throw new Error('Network response was not ok');

          console.log(games);

          gameGrid.innerHTML = '';

          games.forEach(game => {
            const gameTile = document.createElement('div');
            gameTile.className = 'game-tile';
            gameTile.textContent = game.title;

            const gameImage = document.createElement('img');
            gameImage.src = game.cover_image
              ? game.cover_image
              : 'gameinfo_testimage.png';
            gameImage.alt = game.title;
            gameTile.appendChild(gameImage);
            gameImage.src = game.cover_image
              ? game.cover_image
              : 'gameinfo_testimage.png';
            gameImage.alt = game.title;
            gameTile.appendChild(gameImage);

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
});
