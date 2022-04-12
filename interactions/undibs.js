"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const undibs = async (userInfo) => {
    
    const nextEvent = await func.getNextEvent();
    const attending = func.checkAttendance(userInfo.id, nextEvent);
    // console.log("USER HAS DIBS:" + userHasDibs);
    if (nextEvent && attending) {
        const userHasDibs = nextEvent.ig_attendees.list.filter(user => user.discord_id === userInfo.id)[0].discord_dibs;
        if (userHasDibs) {
            
            const updatedDibs = nextEvent.ig_attendees.list.map(user => {
                const temp = Object.assign({}, user)
                if (temp.discord_id === userInfo.id) {
                    temp.discord_dibs = "";
                    return temp;     
                } else {
                    return temp;
                }
            });

            const prevDibs = nextEvent.ig_attendees.list.filter(user => user.discord_id === userInfo.id);
            // console.log("prevDibs: " + JSON.stringify(prevDibs, null, 2));
            const newAttendees = {ig_attendees: {list: updatedDibs}};
            const res = await func.patchEvent(newAttendees, nextEvent);

            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Dibs zurückgezogen", value: "**" + userInfo.name + "** macht **" + prevDibs[0].discord_dibs + "** wieder frei."});
            return botResponse;

        } else {
            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Keine dibs", value: "**" + userInfo.name + "** hat keine dibs."});
            return botResponse;
        } 
    } else if (nextEvent && !attending) {
        const botResponse = new MessageEmbed()
            .setColor("#e30511")
            .addFields({name: "Nicht angemeldet", value: "**" + userInfo.name + "** wie wärs mit **`!+1`** ?"});
        return botResponse;
    } else {
        return noEventRes;
    }
}

module.exports = undibs;