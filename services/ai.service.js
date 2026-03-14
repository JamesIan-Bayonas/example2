const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL: GEMINI_API_KEY is missing.");
      return;
    }

    // Initialize the SDK
    this.genAI = new GoogleGenerativeAI(apiKey);
    
    // Explicitly set the model
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async analyzeCatchImage(imageBuffer) {
    try {
      if (!this.model) throw new Error("Model not initialized.");

      const prompt = "Identify fish species and estimate weight in kg. Return JSON: {species: string, weight: number}";

      const result = await this.model.generateContent([
        {
          inlineData: {
            data: imageBuffer.toString("base64"),
            mimeType: "image/jpeg"
          }
        },
        { text: prompt }
      ]);

      const response = await result.response;
      const text = response.text().replace(/```json|```/g, "").trim();
      return JSON.parse(text);

    } catch (error) {
      console.error("AI Error:", error.message);
      return { species: "Unknown", weight: 0.0 };
    }
  }
}

module.exports = new AIService();