"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
require("dotenv").config();

const func = require("./functions/func");
const dojo = require("./interactions/dojo");
const attend = require("./interactions/attend");
const unattend = require("./interactions/unattend");
const undibs = require("./interactions/undibs");
const events = require("./interactions/events");
const links = require("./interactions/links");

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

client.on("ready", async () => {
    try {
        console.log("IGor III is ready.");
        console.log(await func.serverUp() ? "API SERVER OK" : "API SERVER ERROR");

        const adminChannel = client.channels.cache.get(process.env.ADMIN_CHANNEL);

        let notified = false;
        setInterval(async () => {
            if (!notified && await func.serverUp()) { //periodically call API and report to discord admins when down or available again
                console.log("SERVER IS OK");
            } else if (!notified) {
                console.log("SERVER IS DOWN");
                adminChannel.send(":fearful: API nicht erreichbar. <@161576641187807232> <@85529712348135424>");
                notified = true;
            } else if (notified && await func.serverUp()) {
                console.log("SERVER IS OK AGAIN");
                adminChannel.send(":relaxed: API ist wieder erreichbar. <@161576641187807232> <@85529712348135424>");
                notified = false;
            }
        }, process.env.REFRESH_INTERVAL);
    } catch (error) {
        console.log(error);
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

    function ifDibs(options) { // 🤮
        if (options[0]) {
            return options[0].value;
        } else {
            return;
        }
    }

    const userInfo = {
        name: interaction.member.nickname ? interaction.member.nickname : interaction.user.username, //use server nickname instead of global username when available
        id: "<@" + interaction.user.id + ">",
        dibs: ifDibs(interaction.options._hoistedOptions) // 🤮
    }

    switch(commandName) { //command handling
        case "dojo":
            await interaction.reply({embeds: [await dojo()]});
            break;
        case "attend":
            await interaction.reply({embeds: [await attend(userInfo)]});
            break;
        case "unattend":
            await interaction.reply({embeds: [await unattend(userInfo)]});
            break;
        case "undibs":
            await interaction.reply({embeds: [await undibs(userInfo)]});
            break;
        case "events":
            await interaction.reply({embeds: [await events()]});
            break;
        case "links":
            await interaction.reply({embeds: [await links()]});
            break;
    }
});

client.login(process.env.BOT_TOKEN); //Discord BOT login token