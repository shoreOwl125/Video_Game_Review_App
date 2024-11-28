document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const reviewInput = document.querySelector('.review-input');
    const postReviewButton = document.querySelector('.post-review');
    const starRating = document.querySelector('.star-rating');
  
    let selectedRating = 0;
  
    // Handle Star Rating Clicks
    if (starRating) {
      starRating.addEventListener('click', (event) => {
        const value = event.target.dataset.value;
        if (value) {
          selectedRating = parseInt(value);
          document.querySelector('.select-rating').textContent = `Rating: ${selectedRating}`;
        }
      });
    }
  
    // Handle Review Submission
    if (postReviewButton) {
      postReviewButton.addEventListener('click', async () => {
        const reviewText = reviewInput.value.trim();
  
        if (!selectedRating || !reviewText) {
          alert('Please provide a rating and review text.');
          return;
        }
  
        const gameId = new URLSearchParams(window.location.search).get('gameId');
        if (!gameId) {
          alert('Invalid game ID.');
          return;
        }
  
        try {
          const response = await fetch('http://127.0.0.1:8000/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              game_id: parseInt(gameId),
              rating: selectedRating,
              review_text: reviewText,
            }),
          });
  
          if (response.ok) {
            alert('Review submitted successfully!');
            window.location.href = `game-info.html?gameId=${gameId}`;
          } else {
            const errorData = await response.json();
            alert(`Failed to submit review: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error submitting review:', error);
          alert('An error occurred while submitting your review. Please try again.');
        }
      });
    }
  });
  