const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// MySQL connection setup
const connection = mysql.createConnection({
  host: process.env.DEV_HOST,
  user: process.env.DEV_USER_STRING,
  password: process.env.DEV_PASSWORD,
  database: process.env.DEV_DATABASE,
});

// File path to your SQL file containing the game data
const sqlFilePath = path.join(__dirname, '../data/gamesDevDBSetup.sql');

// Read and execute SQL file
fs.readFile(sqlFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file', err);
    return;
  }

  connection.query(data, (error, results) => {
    if (error) {
      console.error('Error executing SQL query', error);
      return;
    }
    console.log('Games data successfully loaded into database:', results);
  });

  connection.end();
});
