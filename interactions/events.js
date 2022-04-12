"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const events = async () => {

    const comingEvents = await func.getComingEvents();
        if (comingEvents) {
            const eventList = comingEvents.map(event => {
                return "**" + event.title + "**\n" + new Date(event.start).toLocaleTimeString("de-DE", {hour: '2-digit', minute:'2-digit'}) + " Uhr am " + new Date(event.start).toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); //🤢🤢🤢
            }).join("\n\n");

            const eventsRes = new MessageEmbed()
                .setColor("#0068b3")
                .setTitle("Events / Termine")
                .setDescription(eventList);
            return eventsRes;

        } else {
            return noEventRes;
        }
}

module.exports = events;