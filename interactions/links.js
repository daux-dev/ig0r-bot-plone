"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const links = async () => {
    const linksRes = new MessageEmbed()
            .setColor("#0068b3")
            .setTitle("Links")
            .setDescription("Unsere **[Homepage](https://insertgame.de)**!\nBesuche auch unseren **[Shop](https://shop.spreadshirt.de/Insertgame/)**.\nCheck die **[Anfahrt](http://www.insertgame.de/das-projekt/anfahrt)** und komm vorbei!");
    return linksRes;
}

module.exports = links;