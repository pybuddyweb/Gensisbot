// 🛡️ Load .env file (for TOKEN)
require("dotenv").config();

// 🔗 Discord Setup
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ✅ Bot Ready
client.once("ready", () => {
  console.log(`🤖 Genesis RP Bot logged in as ${client.user.tag}`);
});

// ✅ Keep Alive Code (place at the bottom)
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("✅ Genesis RP Bot is alive!");
});

app.listen(port, () => {
  console.log(`🌐 Keep-alive server started on port ${port}`);
});

// 🔐 Login
client.login(process.env.TOKEN);