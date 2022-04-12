"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const unattend = async (userInfo) => { // ❌❌❌❌❌❌❌❌❌ unregister from next Event
    const nextEvent = await func.getNextEvent();
    if (nextEvent) {
        const attending = func.checkAttendance(userInfo.id, nextEvent);
        if (attending) { //✅user is attending and will unregister

            const newList = nextEvent.ig_attendees.list.filter(user => user.discord_id !== userInfo.id);
            const newDoc = {ig_attendees: {list: newList}};
            const res = await func.patchEvent(newDoc, nextEvent);

            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Abmeldung", value: "Schade **" + userInfo.name + "**."});
            return botResponse;
        } else { //❌user is not attending and therefore cannot unregister
            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Nicht angemeldet", value: "**" + userInfo.name + "** wie wärs mit **`!+1`** ?"});
            return botResponse;
        }
    } else {
        return noEventRes;
    }
}

module.exports = unattend;