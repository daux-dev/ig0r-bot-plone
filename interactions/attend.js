"use strict";

const { Client, MessageEmbed, Guild, GuildMember, Intents} = require("discord.js");
const func = require("../functions/func");
const noEventRes = require("./noevent");

const attend = async (userInfo) => {
    // ✍✍✍✍✍✍✍✍✍ register for the next event
    const nextEvent = await func.getNextEvent();
    if (nextEvent) {
        const attending = func.checkAttendance(userInfo.id, nextEvent);
        const dibsTaken = func.checkDibs(userInfo.dibs, nextEvent);

        if (attending && userInfo.dibs && !dibsTaken) { //❌✅already attending but dibs will update
            const prevDibs = nextEvent.ig_attendees.list.filter(user => user.discord_id === userInfo.id)[0].discord_dibs;
            const updatedDibs = nextEvent.ig_attendees.list.map(user => {
                const temp = Object.assign({}, user)
                if (temp.discord_id === userInfo.id) {
                    temp.discord_dibs = userInfo.dibs;
                    return temp;     
                } else {
                    return temp;
                }
            });

            const newAttendees = {ig_attendees: {list: updatedDibs}};
            const res = await func.patchEvent(newAttendees, nextEvent);
            // console.log(new Date(res.data.end).toLocaleString("de-DE"));

            const botResponse = new MessageEmbed()
                .setColor("#009933")
                .addFields({name: prevDibs ? "Dibs Wechsel" : "Dibs" , value: "**" + userInfo.name + "** " + (prevDibs ? "wechselt von **" + prevDibs + "**" : "hat dibs") + " auf **" + userInfo.dibs + "**."});
            return botResponse;

        } else if (attending && !userInfo.dibs) { //❌❌nothing will register (attending and no dibs)

            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Bereits angemeldet", value: "Viel Spaß **" + userInfo.name + "**."});
            return botResponse;

        } else if (attending && dibsTaken) { //❌❌nothing will register (attending and dibs taken)

            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "Dibs vergeben", value: "Sorry **" + userInfo.name + "**,\n**" + userInfo.dibs + "** ist schon belegt!"});
            return botResponse;

        } else if (!attending && dibsTaken) { //✅❌user will register but dibs is already taken

            const oldDibs = userInfo.dibs;
            userInfo.dibs = "";
            const res = await func.registerAttend(userInfo, nextEvent);

            const botResponse = new MessageEmbed()
                .setColor("#009933")
                .addFields({name: "Neue Anmeldung", value: "**" + userInfo.name + "** wurde angemeldet!\n:no_entry: **" + oldDibs + "** ist aber schon vergeben!"});
            return botResponse;

        } else if (!attending && !dibsTaken) {  // ✅✅ user and dibs(if called) are registered

            const res = await func.registerAttend(userInfo, nextEvent);
            // console.log(nextEvent.ig_attendees);
            // console.log(res.data.ig_attendees);
            // console.log("user registered");

            const botResponse = new MessageEmbed()
                .setColor("#009933")
                .addFields({name: "Neue Anmeldung", value: "**" + userInfo.name + "** wurde angemeldet" + (userInfo.dibs ? "!\nUnd hat dibs auf **" + userInfo.dibs + "**." : "!")});
            return botResponse;

        } else {
            const botResponse = new MessageEmbed()
                .setColor("#e30511")
                .addFields({name: "??????", value: "Etwas unerwartetes ist passiert.\n<@161576641187807232> sollte sich das mal ansehen!"});
            return botResponse;
            const dateNow = new Date().toLocaleString();
            console.log(dateNow + "\n" + JSON.stringify(userInfo, null, 2) + "\n" + JSON.stringify(nextEvent, null, 2));
        }
    } else {
        return noEventRes;
    }
}

module.exports = attend;