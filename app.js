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
            if (await func.serverUp() && !notified) {
                console.log("SERVER IS OK");
            } else if (!notified) {
                console.log("SERVER IS DOWN");
                adminChannel.send(":rage: API nicht erreichbar. <@161576641187807232> <@85529712348135424>");
                notified = true;
            } else if (notified) {
                console.log("SERVER IS OK AGAIN");
                adminChannel.send(":smile: API ist wieder erreichbar. <@161576641187807232> <@85529712348135424>");
                notified = false;
            }
        }, process.env.REFRESH_INTERVAL);
    } catch (error) {
        console.log(error);
    }
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    // console.log(interaction.member.nickname);
    // console.log(interaction.user.username);
    // console.log(interaction.options);
	const { commandName } = interaction;

    

    // console.log(interaction.options._hoistedOptions);

    function ifDibs(options) {
        if (options[0]) {
            return options[0].value;
        } else {
            return;
        }
    }

    const userInfo = {
        name: interaction.member.nickname ? interaction.member.nickname : interaction.user.username, //use server nickname when available
        id: "<@" + interaction.user.id + ">",
        dibs: ifDibs(interaction.options._hoistedOptions)
    }

	if (commandName === 'dojo') {

        await interaction.reply({embeds: [await dojo(possibleDibs)]});

	} else if (commandName === 'attend') {

		await interaction.reply({embeds: [await attend(userInfo)]});

	} else if (commandName === 'unattend') {

		await interaction.reply({embeds: [await unattend(userInfo)]});

	} else if (commandName === 'undibs') {

		await interaction.reply({embeds: [await undibs(userInfo)]});

	} else if (commandName === 'events') {

		await interaction.reply({embeds: [await events()]});

	} else if (commandName === 'links') {

		await interaction.reply({embeds: [await links()]});

	} else if (commandName === 'user') {

		await interaction.reply("hello");

	}
});

const possibleDibs = [
    "couch", 
    "smolcouch", 
    "bigcouch", 
    "matratze", 
    "feldbett1", 
    "feldbett2", 
    "feldbett3"
];

client.on("messageCreate", async message => { 
    try {
    if (message.channel.type === "dm") return;

    const input = message.content.split(" ", 3);
    const command = input[0];
    const value = input[1];
    const value2 = ifDibs(input[2]);

    function ifDibs(dib) {
        if (possibleDibs.includes(dib)) {
            return dib;
        } else {
            return "";
        }
    } 

    const userInfo = { //user info extracted from message author
        name: message.guild.members.cache.get(message.author.id).nickname ? message.guild.members.cache.get(message.author.id).nickname : message.author.username, //use server nickname when available, fallback to global username
        id: message.author.toString(),
        dibs: ifDibs(value)
    }
    
    if (command === "!dojo") {
        message.channel.send("```Bitte die neuen slash-commands nutzen (/dojo, /attend). Discord will das so.```");
    }

    if (command === "!attend" || command === "!+1" || command === "!dibs") { 
        message.channel.send("```Bitte die neuen slash-commands nutzen (/dojo, /attend). Discord will das so.```");
    }

    if (command === "!unattend" || command === "!-1" ) { 
        message.channel.send("```Bitte die neuen slash-commands nutzen (/dojo, /attend). Discord will das so.```");
    }

    if (command === "!undibs") {
        message.channel.send("```Bitte die neuen slash-commands nutzen (/dojo, /attend). Discord will das so.```");
    }

    if (command === "!termine" || command === "!events") {
        message.channel.send("```Bitte die neuen slash-commands nutzen (/dojo, /attend). Discord will das so.```");
    }

    // if (command === "!help") {
    //     const helpRes = new MessageEmbed()
    //         .setColor("#f0f000")
    //         .setTitle("Hilfe / Info")
    //         .setDescription("**Schlafplätze:** \n" + possibleDibs.join(", ") + "\n\n**Befehle:**")
    //         .addFields(
    //             {name: "!dojo" , value: "Infos zum nächsten Termin inkl. Teilnehmer.", inline: true },  
    //             {name: "!+1 oder !attend" , value: "Anmeldung zum nächsten Termin.", inline: true },
    //             {name: "!dibs *couch*" , value: "Reservierung eines Schlafplatzes.", inline: true },
    //             {name: "!events oder !termine" , value: "Liste zukünftiger Termine.", inline: true },
    //             {name: "!-1 oder !unattend", value: "Abmeldung vom nächsten Termin.", inline: true },
    //             {name: "!undibs", value: "Zurückziehen der Schlafplatzreservierung.", inline: true },
    //             {name: "!links", value: "Liste von Verlinkungen! *(z.b. Homepage, Shop, Anfahrt)*", inline: true}
    //         );
    //     message.channel.send({ embeds: [helpRes]})
    // }
} catch (error) {
    console.log(error);
}
}); //END OF CLIENT.ON MESSAGE



//⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙
//⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙
//⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙⚙

const noEventRes = new MessageEmbed()
    .setColor("#e30511")
    .setTitle("Events / Termine")
    .setDescription("Keine Termine eingetragen.");

client.login(process.env.BOT_TOKEN); //Discord BOT login token