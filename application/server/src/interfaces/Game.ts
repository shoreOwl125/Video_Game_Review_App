export interface Game {
  game_id: number;
  title: string;
  description: string | null;
  genre: string;
  tags: string[];
  platforms: string[];
  playtime_estimate: number | null;
  developer: string | null;
  publisher: string | null;
  game_mode: 'single-player' | 'multiplayer' | 'both';
  release_date: Date;
  review_rating: number;
  cover_image: string | null;
  created_at: Date;
  updated_at: Date;
}
