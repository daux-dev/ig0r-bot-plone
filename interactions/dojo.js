"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const dojo = async (possibleDibs) => { // 📄📄📄📄📄📄📄📄📄 displays all information on current event
    const nextEvent = await func.getNextEvent();
    const eventDate = new Date(nextEvent.start);
    const eventDateString = eventDate.toLocaleDateString("de-DE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const eventTimeString = eventDate.toLocaleTimeString("de-DE", {hour: '2-digit', minute:'2-digit'});
    if (nextEvent) { //check if an event is found
        var count = 0;
        const attList = nextEvent.ig_attendees.list.map(x => {           
            if (x.discord_dibs) {
                count = count + 1;
                return  count.toString() + ". **" + x.discord_name + "** dibs **" + x.discord_dibs + "** :sleeping_accommodation:";
            } else {
                count = count + 1;
                return  count.toString() + ". **" + x.discord_name + "**";
            }     
        }).join("\n");

        function ifEmpty(x, y) {
            if (x.length === 0) {
                return y;
            } else {
                return x;
            }
        }

        function ifNotEmpty(x, y) {
            if (x.length !== 0) {
                return x + y;
            } else {
                return x;
            }
        }

        const takenDibs = nextEvent.ig_attendees.list.map(x => {
            return x.discord_dibs;
        }).filter(x => x);

        const takenDibsList = takenDibs.map(x => {
            return "*~~" + x + "~~*";
        })

        var leftover = []; 
        possibleDibs.forEach(dib => {
            if (!takenDibs.includes(dib)) {
                leftover.push(dib);
            }
        });

        const dojoRes = new MessageEmbed()
            .setColor("#0068b3")
            .setAuthor("Insertgame", "http://www.insertgame.de/dojobot/ig-logo.png", "https://twitter.com/Insertgamedojo")
            .setThumbnail(func.isValidHttpUrl(nextEvent.event_image) ? nextEvent.event_image : "http://www.insertgame.de/dojobot/time_to_ape.png")
            .setTitle(nextEvent.title)
            .setURL("http://www.insertgame.de")
            .setDescription(nextEvent.description)
            .addFields(
                {name: "Anmeldungen: " + nextEvent.ig_attendees.list.length, value: ifEmpty(attList, "Noch keiner."), inline: false},
                {name: "Schlafplätze: " + leftover.length + "/" + possibleDibs.length + " frei", value: ifNotEmpty(takenDibsList.join(", "), ", ") + leftover.join(", "), inline: false}
            )
            .setFooter("Geöffnet ab " + eventTimeString + " Uhr am " + eventDateString);
        // message.channel.send({ embeds: [dojoRes]});
        return dojoRes;
    } else {
        return noEventRes;
    }

}
module.exports = dojo;