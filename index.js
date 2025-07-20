
// 🛡️ Load .env file (for TOKEN)
require("dotenv").config();

// 🔗 Discord Setup
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const WELCOME_CHANNEL_ID = "1395669553156984853";
const BYE_CHANNEL_ID = "1395669579614785536";
const RULES_CHANNEL_ID = "1274780635323437220";
const VISA_CHANNEL_ID = "1362766489253318690";
const WELCOME_IMAGE = "https://i.ibb.co/YBCypNWG/GCRP-2.png";

client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.get(WELCOME_CHANNEL_ID);
  if (!channel) return;

  const welcomeEmbed = new EmbedBuilder()
    .setTitle("📂 Case File Opened")
    .setDescription(
      `👤 Name        : <@${member.user.id}>
` +
      `📛 Charges     : Unauthorized Entry into Genesis RP
` +
      `🔍 Status      : Under RP Surveillance
` +
      `📅 Booked On   : Today
` +
      `🔐 Cell Block  : <#${VISA_CHANNEL_ID}>

` +
      `📌 Rules → <#${RULES_CHANNEL_ID}>

` +
      `📝 Note: This one’s got potential... keep watch 👀`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage(WELCOME_IMAGE)
    .setColor(0xffd700);

  await channel.send({ embeds: [welcomeEmbed] });
});

client.on("guildMemberRemove", async (member) => {
  const channel = member.guild.channels.cache.get(BYE_CHANNEL_ID);
  if (!channel) return;

  const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: 20 });
  const kickLog = auditLogs.entries.first();
  const wasKicked =
    kickLog &&
    kickLog.target.id === member.id &&
    kickLog.createdTimestamp > Date.now() - 5000;

  const reason = wasKicked
    ? `🔨 Kicked by   : ${kickLog.executor.tag}
📛 Reason      : ${kickLog.reason || "No reason provided"}`
    : `📛 Charges     : Voluntary Exit from Genesis RP`;

  const byeEmbed = new EmbedBuilder()
    .setTitle("📂 Case File Closed")
    .setDescription(
      `👤 Name        : ${member.user.tag}
${reason}
` +
      `📅 Released On : Today
🗃️ Final Status: RP Session Terminated ❌

` +
      `📝 Note: Their story ends here... or maybe continues elsewhere 🌫️`
    )
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .setImage(WELCOME_IMAGE)
    .setColor(wasKicked ? 0xff0000 : 0x8b0000);

  await channel.send({ embeds: [byeEmbed] });
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content === "!status") {
    return message.channel.send(`✅ Bot is active and running as **${client.user.tag}**!`);
  }

  if (!message.content.startsWith("!genesisrp")) return;

  const allowedRoles = [
    "Head", "Developers", "Administration", "Management",
    "Discordist", "Ingame Admin", "Ticket Staff", "Whitelist Manager", "Govt",
  ];

  const hasPermission = message.member.roles.cache.some((role) => allowedRoles.includes(role.name));

  if (!hasPermission) {
    return message.reply("🚫 You do not have permission to use this command.")
      .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
  }

  const content = message.content.slice("!genesisrp".length).trim();

  if (!content) {
    return message.reply("⚠️ Please include a message to forward.
Usage: `!genesisrp <your message>`")
      .then((msg) => setTimeout(() => msg.delete().catch(() => {}), 5000));
  }

  try {
    await message.channel.send({
      content: content,
      allowedMentions: { parse: ["users", "roles", "everyone"] },
    });

    await message.delete().catch(() => {});
  } catch (err) {
    console.error("❌ Error forwarding message:", err);
  }
});

client.once("ready", () => {
  console.log(`🤖 Genesis RP Bot logged in as ${client.user.tag}`);
});

// Keep alive server
const app = express();
app.get("/", (req, res) => res.send("✅ Genesis RP Bot is alive!"));
app.listen(3000, () => console.log("🌐 Keep-alive server started on port 3000"));

// Login
client.login(process.env.TOKEN);
