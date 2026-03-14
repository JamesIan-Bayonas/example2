require('dotenv').config();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const aiService = require('./services/ai.service');
const isdalogApi = require('./services/isdalog.api');

const bot = new Telegraf(process.env.BOT_TOKEN);

// Phase 1: The First Interaction
bot.start(async (ctx) => {
    try {
        await ctx.reply("🔄 Connecting your maritime identity to IsdaLog...");
        
        // Execute the Handshake across the Docker network
        await isdalogApi.handshake(ctx.from.id, ctx.from.first_name);
        
        await ctx.reply(`✅ Welcome aboard, ${ctx.from.first_name}! Send me a photo of your catch to log it.`);
    } catch (error) {
        await ctx.reply("⚠️ Error connecting to the maritime database. Please try again.");
    }
});

bot.on('photo', async (ctx) => {
    try {
        await ctx.reply("🐟 Scanning catch with Edge-AI...");
        
        const photo = ctx.message.photo[ctx.message.photo.length - 1];
        const fileLink = await ctx.telegram.getFileLink(photo.file_id);
        
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data, 'binary');

        const aiData = await aiService.analyzeCatchImage(imageBuffer);
        
        // Send catch mapping the telegram ID
        await isdalogApi.logCatch(aiData, ctx.from.id);
        
        await ctx.reply(`✅ Logged Successfully!\n\nSpecies: ${aiData.species}\nWeight: ${aiData.weight} kg`);
    } catch (error) {
        console.error(error);
        await ctx.reply("⚠️ Failed to process. Please ensure the image clearly shows the fish.");
    }
});

bot.launch().then(() => {
    console.log('[Bot] Telegram connection established. Identity Module active.');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));