import { Request, Response } from 'express';
import ReviewModel from '../models/ReviewModel';

const reviewModel = new ReviewModel();

// Controller to create a new review
export const createReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { user_id, game_id, rating, review_text } = req.body;
    const reviewId = await reviewModel.createReview({
      user_id,
      game_id,
      rating,
      review_text,
    });
    res.status(201).json({ message: 'Review created successfully', reviewId });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review', error });
  }
};

// Controller to get review by ID
export const getReviewById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const review = await reviewModel.getReviewById(Number(id));

    if (!review) {
      res.status(404).json({ message: 'Review not found' });
    } else {
      res.status(200).json(review);
    }
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Error fetching review', error });
  }
};

//get reviews by game id
export const getReviewByGameId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gameId } = req.params;
    const reviews = await reviewModel.getReviewByGameId(Number(gameId));

    if (!reviews || reviews.length === 0) {
      res.status(404).json({ message: 'No reviews found for this game' });
    } else {
      res.status(200).json(reviews); // Send the array of reviews
    }
  } catch (error) {
    console.error('Error fetching reviews by gameId:', error);
    res.status(500).json({ message: 'Error fetching reviews', error });
  }
};

// Controller to update a review by ID
export const updateReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    await reviewModel.updateReview(Number(id), updates);
    res.status(200).json({ message: 'Review updated successfully' });
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review', error });
  }
};

// Controller to delete a review by ID
export const deleteReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    await reviewModel.deleteReview(Number(id));
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review', error });
  }
};
