// index.js
require('dotenv').config();
const { Telegraf } = require('telegraf');
const aiService = require('./services/ai.service');
const isdalogApi = require('./services/isdalog.api');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.on('photo', async (ctx) => {
  try {
    ctx.reply("Processing catch image with Fishery-AI...");

    // 1. Get the image from Telegram
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const link = await ctx.telegram.getFileLink(fileId);
    
    // 2. Analyze with AI
    const analysis = await aiService.analyzeCatchImage(link); 

    // 3. Log to IsdaLog (The industrial integration step)
    await isdalogApi.logCatch(analysis);

    ctx.reply(`✅ Catch Logged!\nSpecies: ${analysis.species}\nWeight: ${analysis.weight}kg`);
  } catch (err) {
    ctx.reply("⚠️ Error logging catch. Please try again.");
    console.error(err);
  }
});

bot.launch();