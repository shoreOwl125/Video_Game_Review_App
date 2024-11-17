-- Drop the existing database
DROP DATABASE IF EXISTS ratings_dev_db;

-- Create the database
CREATE DATABASE IF NOT EXISTS ratings_dev_db;

-- Use the database
USE ratings_dev_db;

CREATE TABLE IF NOT EXISTS user_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    search_history JSON,
    interests JSON,
    view_history JSON,
    review_history JSON,
    genres JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255) DEFAULT 'application/web/public/Default-Profile-Picture.jpg', -- Added default profile picture path
    theme_preference ENUM('light', 'dark') DEFAULT 'light',
    user_data_id INT,  -- Foreign key linking to user_data table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_data_id) REFERENCES user_data(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS games (
    game_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    genre VARCHAR(100),
    tags JSON,
    platforms JSON,
    playtime_estimate INT,
    developer VARCHAR(255),
    publisher VARCHAR(255),
    game_mode ENUM('single-player', 'multiplayer', 'both'),
    release_date DATE,
    review_rating INT CHECK (review_rating BETWEEN 1 AND 10),
    cover_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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

INSERT INTO user_data (search_history, interests, view_history, review_history, genres) VALUES
    ('["The Witcher 3", "Cyberpunk 2077", "Hades"]', '["sports", "action"]', '["The Witcher 3"]', '["1"]', '["RPG", "Adventure"]'),
    ('["Minecraft", "League of Legends", "Dark Souls III"]', '["adventure", "strategy"]', '["Minecraft"]', '["2"]', '["Strategy", "Puzzle"]'),
    ('["Animal Crossing", "Stardew Valley"]', '["puzzle", "arcade"]', '["Animal Crossing"]', '["3"]', '["Simulation"]'),
    ('["Battlefield V", "Call of Duty: Warzone"]', '["action", "sports"]', '["Battlefield V"]', '["4"]', '["Shooter"]'),
    ('["Among Us", "Phasmophobia"]', '["arcade", "mystery"]', '["Among Us"]', '["5"]', '["Horror"]'),
    ('["Assassins Creed Odyssey", "God of War"]', '["RPG", "adventure"]', '["God of War"]', '["6"]', '["Adventure"]'),
    ('["Gran Turismo Sport", "Forza Horizon 4"]', '["racing", "arcade"]', '["Gran Turismo Sport"]', '["7"]', '["Racing"]'),
    ('["Super Mario Odyssey", "Zelda: Breath of the Wild"]', '["strategy", "sports"]', '["Super Mario Odyssey"]', '["8"]', '["Platformer"]'),
    ('["Starcraft II", "Command & Conquer"]', '["strategy", "simulation"]', '["Starcraft II"]', '["9"]', '["RTS"]'),
    ('["Doom Eternal", "Half-Life 2"]', '["action", "horror"]', '["Doom Eternal"]', '["10"]', '["Shooter"]');

INSERT INTO users (name, email, password, profile_pic, theme_preference, user_data_id) VALUES
    ('Alice Smith', 'alice.smith@example.com', 'password1', '/uploads/profiles/alice.jpg', 'light', 1),
    ('Bob Johnson', 'bob.johnson@example.com', 'password2', '/uploads/profiles/bob.jpg', 'dark', 2),
    ('Charlie Brown', 'charlie.brown@example.com', 'password3', '/uploads/profiles/charlie.jpg', 'light', 3),
    ('David Wilson', 'david.wilson@example.com', 'password4', '/uploads/profiles/david.jpg', 'dark', 4),
    ('Eve Davis', 'eve.davis@example.com', 'password5', '/uploads/profiles/eve.jpg', 'light', 5),
    ('Frank Miller', 'frank.miller@example.com', 'password6', '/uploads/profiles/frank.jpg', 'dark', 6),
    ('Grace Lee', 'grace.lee@example.com', 'password7', '/uploads/profiles/grace.jpg', 'light', 7),
    ('Henry Adams', 'henry.adams@example.com', 'password8', '/uploads/profiles/henry.jpg', 'dark', 8),
    ('Ivy Green', 'ivy.green@example.com', 'password9', '/uploads/profiles/ivy.jpg', 'light', 9),
    ('Jack White', 'jack.white@example.com', 'password10', '/uploads/profiles/jack.jpg', 'dark', 10);
