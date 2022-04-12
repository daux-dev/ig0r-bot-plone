const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");

const noEventRes = new MessageEmbed()
    .setColor("#e30511")
    .setTitle("Events / Termine")
    .setDescription("Keine Termine eingetragen.");

module.exports = noEventRes;