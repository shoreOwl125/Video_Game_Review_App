/*

1. Implement embeddingService.ts: Write functions for data fetching, preprocessing, embedding generation, and PCA.
2. Set Up Vector Database Connection in vectorDatabaseService.ts: If using AWS OpenSearch, set up the connection here.
3. Create Recommendation Logic in recommendationService.ts: Write the logic for fetching embeddings and calculating recommendations.
4. Expose Recommendations in recommendationRoutes.ts: Use your recommendation logic and create endpoints for users to get game recommendations.

*/

import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { PCA } from 'ml-pca';
import { getPool } from '../connections/database';
import { Game as GameInterface } from '../interfaces/Game';
import { UserData as UserDataInterface } from '../interfaces/UserData';
import Game from '../models/GameModel';
import UserDataModel from '../models/UserDataModel';

let useModel: use.UniversalSentenceEncoder | null = null;

const userDataModel = new UserDataModel();
const gameModel = new Game();

// Load the Universal Sentence Encoder model
export const loadUSEModel = async () => {
  if (!useModel) {
    useModel = await use.load();
    console.log('Universal Sentence Encoder model loaded successfully.');
  }
};

// Fetch games from the database
export const fetchGamesData = async (): Promise<GameInterface[]> => {
  return await gameModel.getAllGames();
};

// Fetch specific user data by user ID using the model function
export const fetchUserData = async (
  userId: number
): Promise<UserDataInterface | null> => {
  return await userDataModel.getUserDataById(userId);
};

// Generate embeddings using Universal Sentence Encoder
export const generateEmbeddings = async (
  games: GameInterface[]
): Promise<tf.Tensor2D> => {
  await loadUSEModel();

  const inputStrings = games.map(
    game => `${game.title} ${game.description || ''}`
  );

  if (useModel) {
    return (await useModel.embed(inputStrings)) as tf.Tensor2D;
  } else {
    throw new Error('Universal Sentence Encoder model not loaded.');
  }
};

// Convert Tensor to array for further processing (like PCA)
export const tensorToArray = async (
  tensor: tf.Tensor2D
): Promise<number[][]> => {
  const array = (await tensor.array()) as number[][];
  tensor.dispose();
  return array;
};

// Apply PCA to reduce embeddings dimensionality
export const applyPCA = (
  embeddings: number[][],
  components: number = 2
): number[][] => {
  const pcaInstance = new PCA(embeddings);
  const reduced = pcaInstance
    .predict(embeddings, { nComponents: components })
    .to2DArray(); // Convert Matrix to number[][]
  return reduced;
};

// Main function to generate embeddings with PCA
export const generateGameEmbeddingsWithPCA = async (): Promise<number[][]> => {
  const games = await fetchGamesData();
  const embeddingsTensor = await generateEmbeddings(games);
  const embeddingsArray = await tensorToArray(embeddingsTensor);
  const reducedEmbeddings = applyPCA(embeddingsArray);
  return reducedEmbeddings;
};
