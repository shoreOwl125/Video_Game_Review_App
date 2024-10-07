// igdbFetch.js
const axios = require('axios');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
require('dotenv').config();

// IGDB API Credentials
const CLIENT_ID = '7pw7xcokux69rdg1nqv5lw2x8xc5a9'; 
const CLIENT_SECRET = 'wpu5vs02bm6w9pqwb8dk2wspe07m6c'; 
const IGDB_URL = 'https://api.igdb.com/v4/games';

// Get the access token from Twitch
async function getAccessToken() {
  try {
      const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
          params: {
              client_id: CLIENT_ID,
              client_secret: CLIENT_SECRET,
              grant_type: 'client_credentials'
          }
      });
      return response.data.access_token;
  } catch (error) {
      console.error('Error fetching access token:', error);
      return null;
  }
}

// Fetch video game data from IGDB
async function fetchGameData() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
      console.log('Unable to fetch access token. Exiting.');
      return;
  }

  const headers = {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${accessToken}`
  };

  const data = 'fields name,genres,release_dates.human,summary; limit 100;';

  try {
      const response = await axios.post(IGDB_URL, data, { headers });
      return response.data;
  } catch (error) {
      console.error('Error fetching game data:', error);
      return null;
  }
}

// Save data to CSV
async function saveDataToCsv(games) {
  const csvWriter = createCsvWriter({
      path: './application/server/data/games.csv',
      header: [
          {id: 'name', title: 'Game Name'},
          {id: 'genres', title: 'Genres'},
          {id: 'release_dates', title: 'Release Date'},
          {id: 'summary', title: 'Description'}
      ]
  });

  try {
      await csvWriter.writeRecords(games);
      console.log('Game data saved to CSV.');
  } catch (error) {
      console.error('Error writing to CSV:', error);
  }
}


// Main function to fetch and save game data
async function main() {
  const games = await fetchGameData();
  if (games) {
      await saveDataToCsv(games);
  }
}

main();