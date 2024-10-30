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
    release_date DATE,
    cover_image VARCHAR(255),
    review_rating INT CHECK (review_rating BETWEEN 1 AND 10),  -- New column for rating from 1 to 10
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
    ('["The Witcher 3", "Cyberpunk 2077", "Hades", "Assassin\s Creed Valhalla", "Halo Infinite", "Fortnite", "Red Dead Redemption 2", "Apex Legends", "Valorant"]', '["sports", "action", "fantasy", "adventure", "simulation"]', '["The Witcher 3", "Valorant", "Hades", "Fortnite"]', '["1", "2", "5", "8"]', '["RPG", "Adventure", "Shooter", "Puzzle", "Sports"]'),
    ('["Minecraft", "League of Legends", "Dark Souls III", "Hollow Knight", "Dota 2", "Rocket League", "Overwatch", "Skyrim", "Destiny 2"]', '["adventure", "strategy", "racing", "arcade", "mystery"]', '["League of Legends", "Hollow Knight", "Destiny 2", "Overwatch"]', '["3", "4", "7", "9"]', '["Shooter", "Puzzle", "Racing", "Action", "Adventure"]'),
    ('["Animal Crossing", "Stardew Valley", "SimCity", "Cities: Skylines", "Zoo Tycoon", "The Sims 4", "Civilization VI", "Age of Empires II", "RollerCoaster Tycoon"]', '["puzzle", "arcade", "simulation", "racing", "fantasy"]', '["Stardew Valley", "SimCity", "Age of Empires II", "Zoo Tycoon"]', '["5", "6", "8", "10"]', '["Strategy", "Puzzle", "Sports", "Adventure", "Shooter"]'),
    ('["Battlefield V", "Call of Duty: Warzone", "Apex Legends", "Fortnite", "Overwatch", "CS:GO", "PUBG", "Escape from Tarkov", "Rainbow Six Siege"]', '["action", "sports", "racing", "mystery", "sci-fi"]', '["Apex Legends", "Overwatch", "Fortnite", "Rainbow Six Siege"]', '["7", "8", "9", "10"]', '["Adventure", "Shooter", "Puzzle", "Action", "Sci-Fi"]'),
    ('["Among Us", "Phasmophobia", "Dead by Daylight", "Left 4 Dead 2", "Resident Evil Village", "Silent Hill", "Outlast", "Alien: Isolation", "The Evil Within"]', '["arcade", "puzzle", "mystery", "horror", "fantasy"]', '["Phasmophobia", "Resident Evil Village", "Silent Hill", "Outlast"]', '["9", "10", "11", "12"]', '["Horror", "Mystery", "Shooter", "Adventure", "Fantasy"]'),
    ('["Assassin\s Creed Odyssey", "God of War", "Horizon Zero Dawn", "Ghost of Tsushima", "Shadow of the Tomb Raider", "Uncharted 4", "Far Cry 5", "Sekiro", "Bloodborne"]', '["RPG", "adventure", "action", "strategy", "sci-fi"]', '["God of War", "Horizon Zero Dawn", "Far Cry 5", "Sekiro"]', '["11", "12", "13", "14"]', '["Action", "Puzzle", "Shooter", "Sci-Fi", "Fantasy"]'),
    ('["Gran Turismo Sport", "Forza Horizon 4", "Need for Speed Heat", "F1 2020", "Project CARS 2", "Dirt 5", "Assetto Corsa", "Wreckfest", "Burnout Paradise"]', '["action", "arcade", "puzzle", "fantasy", "simulation"]', '["Forza Horizon 4", "Gran Turismo Sport", "Dirt 5", "Burnout Paradise"]', '["13", "14", "15", "16"]', '["Racing", "Arcade", "Puzzle", "Fantasy", "Sports"]'),
    ('["Super Mario Odyssey", "The Legend of Zelda: Breath of the Wild", "Luigi\s Mansion 3", "Mario Kart 8 Deluxe", "Splatoon 2", "Super Smash Bros. Ultimate", "Donkey Kong Country", "Yoshi\s Crafted World", "Kirby Star Allies"]', '["strategy", "sports", "adventure", "action", "simulation"]', '["Super Mario Odyssey", "Mario Kart 8 Deluxe", "Splatoon 2", "The Legend of Zelda: Breath of the Wild"]', '["15", "16", "17", "18"]', '["Platformer", "Adventure", "Puzzle", "Action", "Sports"]'),
    ('["Starcraft II", "Command & Conquer", "Warcraft III", "Total War: Three Kingdoms", "Age of Empires II", "Halo Wars", "XCOM 2", "Company of Heroes", "Wargame: Red Dragon"]', '["puzzle", "RPG", "strategy", "mystery", "simulation"]', '["Starcraft II", "Age of Empires II", "Company of Heroes", "Warcraft III"]', '["17", "18", "19", "20"]', '["Strategy", "Action", "Shooter", "Adventure", "Puzzle"]'),
    ('["Doom Eternal", "Quake Champions", "Half-Life 2", "Borderlands 3", "Far Cry 6", "Halo Infinite", "Titanfall 2", "Metro Exodus", "Wolfenstein II"]', '["arcade", "sports", "mystery", "action", "fantasy"]', '["Doom Eternal", "Halo Infinite", "Metro Exodus", "Far Cry 6"]', '["19", "20", "21", "22"]', '["Shooter", "Action", "Adventure", "Sci-Fi", "Fantasy"]');

-- Insert users with references to user data
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

INSERT INTO games (title, description, genre, release_date, cover_image, review_rating) VALUES
('Cyberpunk 2077', 'An open-world RPG set in a dystopian future.', 'RPG', '2020-12-10', 'https://example.com/image_cyberpunk.jpg', 7),
('The Witcher 3: Wild Hunt', 'A fantasy RPG about a monster hunter on an epic quest.', 'RPG', '2015-05-18', 'https://example.com/image_witcher3.jpg', 10),
('Valorant', 'A tactical shooter game with unique characters.', 'Shooter', '2020-06-02', 'https://example.com/image_valorant.jpg', 9),
('Red Dead Redemption 2', 'An action-adventure game set in the Wild West.', 'Adventure', '2018-10-26', 'https://example.com/image_rdr2.jpg', 10),
('Hades', 'A rogue-like dungeon crawler based on Greek mythology.', 'Adventure', '2020-09-17', 'https://example.com/image_hades.jpg', 8),
('Overwatch', 'A team-based shooter with unique heroes and abilities.', 'Shooter', '2016-05-24', 'https://example.com/image_overwatch.jpg', 9),
('Minecraft', 'An open-world sandbox game with creative building.', 'Adventure', '2011-11-18', 'https://example.com/image_minecraft.jpg', 10),
('Dota 2', 'A popular multiplayer online battle arena (MOBA) game.', 'Strategy', '2013-07-09', 'https://example.com/image_dota2.jpg', 8),
('Stardew Valley', 'A farming simulation game with RPG elements.', 'Simulation', '2016-02-26', 'https://example.com/image_stardew_valley.jpg', 9),
('Apex Legends', 'A free-to-play battle royale game with unique characters.', 'Shooter', '2019-02-04', 'https://example.com/image_apex_legends.jpg', 9),
('Assassin\s Creed Valhalla', 'An open-world action RPG set in Viking times.', 'RPG', '2020-11-10', 'https://example.com/image_ac_valhalla.jpg', 8),
('Hollow Knight', 'A challenging, atmospheric adventure in a bug kingdom.', 'Adventure', '2017-02-24', 'https://example.com/image_hollow_knight.jpg', 9),
('League of Legends', 'A popular MOBA game with diverse champions.', 'Strategy', '2009-10-27', 'https://example.com/image_lol.jpg', 8),
('Resident Evil Village', 'A horror survival game with a first-person perspective.', 'Horror', '2021-05-07', 'https://example.com/image_resident_evil.jpg', 9),
('Phasmophobia', 'A multiplayer horror game where players hunt ghosts.', 'Horror', '2020-09-18', 'https://example.com/image_phasmophobia.jpg', 8);

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
