const axios = require('axios');

class AIService {
  constructor() {
    // host.docker.internal allows the Docker container to escape its isolated network 
    // and talk directly to your Windows machine's localhost (where Ollama lives)
    // host.docker.internal allows the Docker container to escape its isolated network 
    // this.ollamaUrl = 'http://host.docker.internal:11434/api/generate';
    // this.ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    // this.ollamaUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434/api/generate';
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://host.docker.internal:11434/api/generate';
    this.modelName = 'llava'; 
  }

  async analyzeCatchImage(imageBuffer) {
    try {
      console.log(`[Edge-AI] Sending image to local RTX 4060 (${this.modelName})...`);

      // UPGRADED PROMPT: Forcing the Vision model to grade its own accuracy
      const prompt = `
        Analyze this image of a fish catch. 
        Identify the species and estimate the weight in kilograms. 
        You MUST respond ONLY with a raw, valid JSON object in this exact format. Do not add any markdown, explanations, or conversational text:
        {"species": "Name of Fish", "weight": 1.5, "confidence": 85}
      `;

      // The payload structure specifically required by Ollama
      const payload = {
        model: this.modelName,
        prompt: prompt,
        images: [imageBuffer.toString('base64')],
        stream: false,
        format: 'json' // Forces Ollama to output strict JSON
      };

      const response = await axios.post(this.ollamaUrl, payload);
      
      const rawText = response.data.response;
      
      // Sanitize any markdown backticks the AI might accidentally include
      const cleanJson = rawText.replace(/```json|```/g, "").trim();
      
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("[Edge-AI] Local Analysis Failed:", error.message);
      // Failsafe updated to include the confidence metric so the bot doesn't panic
      return { species: "Unknown (Local AI Error)", weight: 0.0, confidence: 0 };
    }
  }
}

module.exports = new AIService();