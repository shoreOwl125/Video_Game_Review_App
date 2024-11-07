export interface Game {
  game_id: number;
  title: string;
  description: string | null;
  genre: string;
  tags: string[];
  platforms: string[];
  playtime_estimate: number | null;
  popularity_score: number | null;
  developer: string | null;
  publisher: string | null;
  game_mode: 'single-player' | 'multiplayer' | 'both';
  release_date: Date;
  release_year_bucket: 'new' | 'recent' | 'classic';
  price_range: 'free' | 'budget' | 'mid-range' | 'premium';
  review_rating: number;
  cover_image: string | null;
  created_at: Date;
  updated_at: Date;
}
