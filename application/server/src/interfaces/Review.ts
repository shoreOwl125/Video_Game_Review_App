export interface Review {
  review_id: number;
  user_id: number; // Foreign key reference to User
  game_id: number; // Foreign key reference to Game
  rating: number;
  review_text: string | null;
  created_at: Date;
  updated_at: Date;
}
