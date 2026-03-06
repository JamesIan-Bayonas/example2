// services/isdalog.api.js
const axios = require('axios');

class IsdaLogAPI {
  constructor() {
    this.client = axios.create({
      baseURL: process.env.ISDALOG_API_URL || 'http://isdalog-webserver/api',
      headers: {
        'Authorization': `Bearer ${process.env.ISDALOG_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  /**
   * Sends the AI-analyzed catch data to the Laravel database
   */
  async logCatch(catchData) {
    try {
      const response = await this.client.post('/catches', {
        species: catchData.species,
        weight: catchData.weight,
        location: catchData.location || 'Unknown',
        timestamp: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to log catch to IsdaLog:', error.message);
      throw error;
    }
  }
}

module.exports = new IsdaLogAPI();