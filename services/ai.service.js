const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }

    async identifyFish(imageBuffer, mimeType = 'image/jpeg') {
        try {
            const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = "You are a marine biology expert in the Philippines. Identify the exact species of the fish in this image. Respond with ONLY the common local or English name (e.g., Lapu-Lapu, Yellowfin Tuna, Bangus, Tambakol, Maya-Maya). Do not add any other text, punctuation, or explanation.";

            const imageParts = [
                {
                    inlineData: {
                        data: imageBuffer.toString("base64"),
                        mimeType
                    }
                }
            ];

            const result = await model.generateContent([prompt, ...imageParts]);
            const response = await result.response;
            return response.text().trim();

        } catch (error) {
            console.error("AI Vision Error:", error);
            return "Unknown Fish";
        }
    }
}

module.exports = new AIService();