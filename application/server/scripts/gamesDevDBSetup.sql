USE ratings_dev_db;

CREATE TABLE IF NOT EXISTS `ratings_dev_db`.`games` (
    `game_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `genre` VARCHAR(255) NOT NULL,
    `review_rating` INT CHECK (review_rating >= 1 AND review_rating <= 10),
    `release_date` DATE NOT NULL,
    `cover_image` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Insert fake games data into the `games` table
INSERT IGNORE INTO `ratings_dev_db`.`games` (title, description, genre, review_rating, release_date, cover_image, created_at, updated_at)
VALUES
('Candy Crush Saga', 'Match candies in this fun puzzle game to progress to the next level!', 'Puzzle', 8, '2012-04-12', '/assets/images/placeholder1.jpg', NOW(), NOW()),
('Clash of Clans', 'Build your village, raise a clan, and battle to save the world.', 'Strategy', 9, '2012-08-02', '/assets/images/placeholder2.jpg', NOW(), NOW()),
('PUBG Mobile', 'Engage in epic 100-player battles for survival in this battle royale game.', 'Action', 7, '2018-03-19', '/assets/images/placeholder3.jpg', NOW(), NOW()),
('Asphalt 9: Legends', 'Race in this arcade driving game with a variety of cars.', 'Racing', 8, '2018-07-25', '/assets/images/placeholder4.jpg', NOW(), NOW()),
('Fortnite', 'Battle royale shooter where the last player standing wins!', 'Shooter', 9, '2018-03-12', '/assets/images/placeholder5.jpg', NOW(), NOW()),
('Among Us', 'Join your crewmates in a multiplayer game of teamwork and betrayal!', 'Party', 7, '2018-11-16', '/assets/images/placeholder6.jpg', NOW(), NOW()),
('Call of Duty Mobile', 'Experience the thrill of the battle in the latest mobile Call of Duty game.', 'Action', 9, '2019-10-01', '/assets/images/placeholder7.jpg', NOW(), NOW()),
('Minecraft', 'Create and explore worlds, and build anything your imagination can create.', 'Sandbox', 10, '2011-11-18', '/assets/images/placeholder8.jpg', NOW(), NOW()),
('Pokemon GO', 'Explore the real world and catch Pokemon in augmented reality!', 'Adventure', 8, '2016-07-06', '/assets/images/placeholder9.jpg', NOW(), NOW()),
('Genshin Impact', 'Explore an open world filled with elemental magic and beautiful landscapes.', 'RPG', 9, '2020-09-28', '/assets/images/placeholder10.jpg', NOW(), NOW());