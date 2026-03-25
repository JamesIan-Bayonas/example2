const axios = require('axios');

// Create a single, configured axios instance for all IsdaLog API calls.
// It will automatically use the base URL from your .env file.
const apiClient = axios.create({
  baseURL: process.env.ISDALOG_API_URL,
  timeout: 8000, // Set a timeout of 8 seconds
});

/**
 * Performs the initial handshake with the IsdaLog API.
 * @param {number} telegramId The user's unique Telegram ID.
 * @param {string} name The user's first name.
 * @returns {Promise<any>}
 */
const handshake = async (telegramId, name) => {
  // The URL path here is relative to the baseURL defined above (e.g., /api/handshake)
  const response = await apiClient.post('/api/handshake', { telegramId, name });
  return response.data;
};

const logCatch = async (catchData, telegramId, lat, lon) => {
  const response = await apiClient.post('/api/catches', { ...catchData, telegramId, lat, lon });
  return response.data;
};

module.exports = {
  handshake,
  logCatch,
};