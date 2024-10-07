const mysql = require('mysql');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();

// MySQL database connection
const connection = mysql.createConnection({
    host: process.env.DEV_HOST,
    user: process.env.DEV_USER_STRING,
    password: process.env.DEV_PASSWORD,
    database: process.env.DEV_DATABASE
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

// Function to insert game data into the database
function insertGameData(game) {
    const sql = 'INSERT INTO games (name, genres, release_date, description) VALUES (?, ?, ?, ?)';
    connection.query(sql, [game.name, game.genres, game.release_dates, game.summary], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return;
        }
        console.log('Inserted:', results.insertId);
    });
}

// Read and parse the CSV file
const csvFilePath = './application/server/data/games.csv';
fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => {
        insertGameData(row); // Insert each row into the database
    })
    .on('end', () => {
        console.log('CSV file successfully processed and data inserted');
        connection.end(); // Close the database connection
    })
    .on('error', (error) => {
        console.error('Error reading the CSV file:', error);
    });
