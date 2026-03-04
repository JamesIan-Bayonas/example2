require('dotenv').config();
const { Telegraf } = require('telegraf');
const { GoogleGenAI } = require('@google/genai');
const express = require('express');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. The AI Reasoning Function
async function analyzeCatch(photoUrl) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // This is the prompt that enforces the "Contract" we discussed
    const prompt = "Analyze this fish catch photo. Return ONLY JSON with: {freshness_grade: 'Fresh'|'Fermentation', primary_species: string, contains_bycatch: boolean}.";
    
    // Logic to send the image URL to Gemini goes here
    // For now, let's log the attempt
    console.log("🧠 Sending photo to AI for analysis...");
    return { freshness_grade: "Fresh", primary_species: "Small Shrimp", contains_bycatch: true }; 
}

// 2. The Telegram Listener (The Ear)
bot.on('photo', async (ctx) => {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const fileUrl = await ctx.telegram.getFileLink(fileId);

    ctx.reply("🕒 Analyzing your catch... please wait.");

    // Trigger the AI Brain
    const result = await analyzeCatch(fileUrl);

    // 3. The Routing Logic (The Action)
    if (result.freshness_grade === "Fresh") {
        ctx.reply(`✅ GRADE A: ${result.primary_species} detected. Sending to Fresh Market Buyers...`);
    } else {
        ctx.reply(`⚠️ GRADE B: Found ${result.primary_species}. Routing to Fermentation/Bagoong Processors.`);
    }
});

// 4. Start the Server
app.use(bot.webhookCallback('/secret-path'));
app.listen(process.env.PORT, () => {
    console.log(`🚀 Fishery Orchestrator live on port ${process.env.PORT}`);
});

bot.launch();