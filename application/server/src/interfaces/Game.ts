export interface Game {
  game_id: number;
  title: string;
  description: string | null;
  genre: string;
  release_date: Date;
  cover_image: string | null;
  review_rating: number;
  created_at: Date;
  updated_at: Date;
}
