-- Create the games table if it doesn't exist
CREATE TABLE IF NOT EXISTS games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    genres VARCHAR(255) NOT NULL,
    release_date DATE NOT NULL,
    description TEXT
);