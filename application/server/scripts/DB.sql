-- Drop the existing database
DROP DATABASE IF EXISTS ratings_dev_db;

-- Create the database
CREATE DATABASE IF NOT EXISTS ratings_dev_db;

-- Use the database
USE ratings_dev_db;

-- Create the user_data table first, as it will be referenced by users
CREATE TABLE IF NOT EXISTS user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    search_history TEXT DEFAULT NULL,
    interests TEXT DEFAULT NULL,
    view_history TEXT DEFAULT NULL,
    review_history TEXT DEFAULT NULL,
    genres TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    theme_preference ENUM('light', 'dark') DEFAULT 'light',
    user_data_id INT,  -- Foreign key linking to user_data table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_data_id) REFERENCES user_data(id) ON DELETE SET NULL
);

-- Create the games table
CREATE TABLE IF NOT EXISTS games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    release_date DATE,
    cover_image VARCHAR(255),
    review_rating INT CHECK (review_rating BETWEEN 1 AND 10),  -- New column for rating from 1 to 10
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create the reviews table
CREATE TABLE IF NOT EXISTS reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,  -- Foreign key to users table
    game_id INT NOT NULL,  -- Foreign key to games table
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (game_id) REFERENCES games(game_id) ON DELETE CASCADE
);

-- Populate the user_data table
INSERT INTO user_data (search_history, interests, view_history, review_history, genres) VALUES
('["game1", "game2"]', '["sports", "action"]', '["game1"]', '["1", "2"]', '["RPG", "Adventure"]'),
('["game3", "game4"]', '["adventure", "strategy"]', '["game3"]', '["3", "4"]', '["Shooter", "Puzzle"]'),
('["game2", "game5"]', '["puzzle", "arcade"]', '["game2"]', '["5", "6"]', '["Strategy", "Action"]'),
('["game6", "game1"]', '["action", "sports"]', '["game6"]', '["7", "8"]', '["Adventure", "Shooter"]'),
('["game7", "game3"]', '["arcade", "puzzle"]', '["game7"]', '["9", "10"]', '["Sports", "RPG"]'),
('["game5", "game4"]', '["RPG", "adventure"]', '["game5"]', '["11", "12"]', '["Action", "Puzzle"]'),
('["game8", "game2"]', '["action", "arcade"]', '["game8"]', '["13", "14"]', '["Shooter", "Sports"]'),
('["game1", "game6"]', '["strategy", "sports"]', '["game1"]', '["15", "16"]', '["Puzzle", "Adventure"]'),
('["game9", "game5"]', '["puzzle", "RPG"]', '["game9"]', '["17", "18"]', '["Strategy", "Action"]'),
('["game10", "game7"]', '["arcade", "sports"]', '["game10"]', '["19", "20"]', '["RPG", "Shooter"]');

-- Populate the users table
INSERT INTO users (name, email, password, theme_preference, user_data_id) VALUES
('Alice Smith', 'alice.smith@example.com', '$2a$10$EIX/9rRBRZG0syGm5McZ1.3pO9xPhQPrG2.LM.cHg35VgPBUtHpO2', 'light', 1),
('Bob Johnson', 'bob.johnson@example.com', '$2a$10$R1G6h/DqTr7U9M9j0zBP2u8NEClM24z3cVZx7MucZyU2W/u2W9Y1C', 'dark', 2),
('Charlie Brown', 'charlie.brown@example.com', '$2a$10$6C6sT06aUZzTR6fqE1.WFu2M8Hh1WltWSCC90kYoZBU0vC6oRDS8O', 'light', 3),
('David Wilson', 'david.wilson@example.com', '$2a$10$6C6sT06aUZzTR6fqE1.WFu2M8Hh1WltWSCC90kYoZBU0vC6oRDS8O', 'dark', 4),
('Eve Davis', 'eve.davis@example.com', '$2a$10$F6mR6rPbU5REhDdePeVwx.yfzLv1mtN0Iz0J9aO0uf3lmXbZdfLVS', 'light', 5),
('Frank Miller', 'frank.miller@example.com', '$2a$10$5sP1rGc9QDhf4oB7msytLeRHpG1N9rvICjQOi6UFLlk8i/P0o7JGe', 'dark', 6),
('Grace Lee', 'grace.lee@example.com', '$2a$10$ZVgN9OS7e6QzMN34kfs/rOYl1YKP0YzTxR9fMoPHxH2Q0pVlT4cyS', 'light', 7),
('Henry Adams', 'henry.adams@example.com', '$2a$10$TvXFeQom6TTybg.NpbMVwOcDDgPS1H41yrj8i/NOlMW4JURbJON7O', 'dark', 8),
('Ivy Green', 'ivy.green@example.com', '$2a$10$Jz9q5dMLg6hMZ7D5tYX0xOOG84lEj0EGjC5Y8jX.JFVQdr3.Y.PaK', 'light', 9),
('Jack White', 'jack.white@example.com', '$2a$10$EJ2i7E/9JojRNHtIHLjhl.TYKUOd13KJ8tTO6OCaQxxdX/ZZzNLG.', 'dark', 10);

-- Populate the games table
INSERT INTO games (title, description, genre, release_date, cover_image, review_rating) VALUES
('Game 1', 'An exciting adventure game.', 'Adventure', '2023-01-01', 'https://example.com/image1.jpg', 9),
('Game 2', 'A challenging RPG game.', 'RPG', '2022-02-15', 'https://example.com/image2.jpg', 8),
('Game 3', 'An action-packed shooter.', 'Shooter', '2023-03-10', 'https://example.com/image3.jpg', 7),
('Game 4', 'An arcade classic.', 'Arcade', '2021-04-20', 'https://example.com/image4.jpg', 6),
('Game 5', 'A strategic puzzle game.', 'Puzzle', '2022-05-25', 'https://example.com/image5.jpg', 8),
('Game 6', 'A fun sports game.', 'Sports', '2020-06-30', 'https://example.com/image6.jpg', 7),
('Game 7', 'An engaging RPG with deep story.', 'RPG', '2023-07-05', 'https://example.com/image7.jpg', 10),
('Game 8', 'An action game with intense battles.', 'Action', '2022-08-15', 'https://example.com/image8.jpg', 9),
('Game 9', 'A casual puzzle game for everyone.', 'Puzzle', '2021-09-10', 'https://example.com/image9.jpg', 6),
('Game 10', 'An epic adventure game with beautiful graphics.', 'Adventure', '2023-10-20', 'https://example.com/image10.jpg', 10);

-- Populate the reviews table
INSERT INTO reviews (user_id, game_id, rating, review_text) VALUES
(1, 1, 5, 'Amazing game, loved every minute!'),
(2, 2, 4, 'Great game, but could use more levels.'),
(3, 3, 3, 'Decent game, but gets repetitive.'),
(4, 4, 2, 'Not my type, felt a bit boring.'),
(5, 5, 5, 'Perfect for puzzle lovers!'),
(6, 6, 4, 'Good sports game, fun to play with friends.'),
(7, 7, 5, 'One of the best RPGs I have played.'),
(8, 8, 3, 'Action is good, but the story is lacking.'),
(9, 9, 4, 'Fun puzzle game, relaxing to play.'),
(10, 10, 5, 'An epic adventure from start to finish!'),
(1, 2, 4, 'Enjoyable RPG, but needs better graphics.'),
(2, 3, 5, 'Loved the shooter gameplay, very thrilling.'),
(3, 4, 2, 'Did not find it engaging enough.'),
(4, 5, 4, 'Challenging puzzles, really makes you think.'),
(5, 6, 5, 'Best sports game of the year!'),
(6, 7, 3, 'Decent RPG, but not very memorable.'),
(7, 8, 5, 'Intense action scenes, very engaging!'),
(8, 9, 4, 'Good puzzle game to pass time.'),
(9, 10, 5, 'Incredible adventure, highly recommend it.'),
(10, 1, 4, 'Solid adventure game, worth playing.');
