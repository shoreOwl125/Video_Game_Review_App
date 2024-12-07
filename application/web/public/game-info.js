document.addEventListener('DOMContentLoaded', async () => {
  const gameId = new URLSearchParams(window.location.search).get('gameId');
  if (!gameId) {
    console.error('No gameId found in the current URL.');
    return;
  }

  // Update the "Post Review" link dynamically
  const postReviewLink = document.getElementById('post-review-link');
  if (postReviewLink) {
    postReviewLink.href = `game-review.html?gameId=${gameId}`;
    console.log(`Post Review link set to: ${postReviewLink.href}`);
  } else {
    console.warn('Post Review link element not found.');
  }

  // Fetch and display game data
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/games/${gameId}`);
    if (!response.ok) throw new Error('Failed to fetch game data.');

    const gameData = await response.json();

    // Populate game details
    const gameTitle = document.getElementById('game-title');
    const gameRating = document.getElementById('game-rating');
    const gameReleaseDate = document.getElementById('game-release-date');

    if (gameTitle) gameTitle.innerText = gameData.title;
    if (gameRating) gameRating.innerText = `${gameData.review_rating}/10`;

    if (gameReleaseDate) {
      const releaseDate = new Date(gameData.release_date);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      gameReleaseDate.innerText = `Released On ${releaseDate.toLocaleDateString(
        'en-US',
        options
      )}`;
    }
  } catch (error) {
    console.error('Error fetching game data:', error);
  }

  // Fetch and display reviews for the game
  try {
    const reviewsResponse = await fetch(
      `http://127.0.0.1:8000/api/reviews/game/${gameId}`
    );
    if (!reviewsResponse.ok) throw new Error('Failed to fetch reviews.');

    const reviewsData = await reviewsResponse.json();
    console.log('Fetched reviews:', reviewsData);

    const reviewsContainer = document.querySelector('.game-reviews');
    if (reviewsContainer) {
      reviewsContainer.innerHTML = ''; // Clear existing reviews

      const reviewsArray = Array.isArray(reviewsData)
        ? reviewsData
        : [reviewsData];

      reviewsArray.forEach(review => {
        const box = document.createElement('div');

        // Add classes for styling
        box.classList.add('review-box');

        // Format dates
        const createdAt = new Date(review.created_at);
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        const formattedCreatedAt = createdAt.toLocaleDateString(
          'en-US',
          options
        );

        // Populate review content
        box.innerHTML = `
            <div class="title-box">
              <p class="review-title">${formattedCreatedAt}</p>
              <p class="review-rating-title-box">${review.rating}/5</p>
            </div>
            <div class="content-box">
              <p class="user_id">User: ${review.user_id}</p>
              <p class="review-text">${review.review_text}</p>
            </div>
          `;

        // Append the review box to the container
        reviewsContainer.appendChild(box);
      });
    } else {
      console.warn('Reviews container not found in the DOM.');
    }
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
});
