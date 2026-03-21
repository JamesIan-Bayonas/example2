const axios = require('axios');

class AIService {
  constructor() {
    // We use host.docker.internal to escape the Docker container 
    // and talk directly to your Lenovo's Windows localhost
    this.ollamaUrl = 'http://host.docker.internal:11434/api/generate';
    this.modelName = 'llava'; // The local vision model we downloaded
  }

  async analyzeCatchImage(imageBuffer) {
    try {
      console.log(`[Edge-AI] Sending image to local RTX 4060 (${this.modelName})...`);

      const prompt = `
        Analyze this fish catch image. 
        Identify the exact species and estimate the weight in kilograms. 
        Respond ONLY with a valid JSON object in this exact format:
        {"species": "Fish Name", "weight": 0.0}
      `;

      // The payload for our local Ollama engine
      const payload = {
        model: this.modelName,
        prompt: prompt,
        images: [imageBuffer.toString('base64')],
        stream: false,
        format: 'json' // Ollama feature: Forces the AI to output perfect JSON!
      };

      const response = await axios.post(this.ollamaUrl, payload);
      
      // Ollama returns the generated text inside the 'response' property
      const rawText = response.data.response;
      
      // Parse and return the data
      return JSON.parse(rawText);

    } catch (error) {
      console.error("[Edge-AI] Local Analysis Failed:", error.message);
      // Fallback object to prevent crashing the ecosystem
      return { species: "Unknown (Local AI Error)", weight: 0.0 };
    }
  }
}

module.exports = new AIService();