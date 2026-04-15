require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// --- 1. INITIALIZE BOT & SERVER ---
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(express.json()); // Allows us to read Laravel's JSON data

console.log('🐟 Fisheries-AI Bot is awake and listening...');

// --- 2. EXISTING BOT LOGIC (The Input) ---
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to Isdalog! 🌊\n\nTo log a catch, simply send me a clear photo of the fish.");
});

bot.on('photo', async (msg) => {
    // (Your existing photo AI scanning logic goes here...)
    bot.sendMessage(msg.chat.id, "📸 Photo received! AI is scanning...");
});

// --- 3. THE REVERSE HANDSHAKE (The Output) ---
// This is where Laravel sends the success data when an auction ends
app.post('/api/notify-fisherman', (req, res) => {
    const { listing_id, fish_name, final_price, logistics_type } = req.body;

    console.log(`🛎️ Webhook Triggered: Listing #${listing_id} just sold!`);

    const fishermanChatId = process.env.ADMIN_CHAT_ID;
    
    if (!fishermanChatId) {
        console.error("❌ Error: Missing ADMIN_CHAT_ID in .env!");
        return res.status(500).send("Server Configuration Error");
    }

    // Format the logistics message based on the buyer's choice
    const logisticsMsg = logistics_type === 'request_rider' 
        ? "🛵 A delivery rider is en route to your port location." 
        : "🚙 The buyer will self pick-up the order at your port.";

    // Build the final Telegram message
    const message = `🎉 *CATCH SOLD!* 🎉\n\n` +
                    `*Fish:* ${fish_name}\n` +
                    `*Final Price:* ₱${parseFloat(final_price).toLocaleString()}\n\n` +
                    `*Logistics:* ${logisticsMsg}\n\n` +
                    `Please prepare the catch for handover. Great job today! 🌊`;

    // Shoot the message to the fisherman's phone!
    bot.sendMessage(fishermanChatId, message, { parse_mode: 'Markdown' })
        .then(() => {
            console.log("✅ Success message delivered to Telegram!");
            res.status(200).send("Notification sent");
        })
        .catch((err) => {
            console.error("❌ Failed to send Telegram message:", err.message);
            res.status(500).send("Telegram API Error");
        });
});

// --- 4. START THE SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Isdalog Webhook Server running on http://localhost:${PORT}`);
});