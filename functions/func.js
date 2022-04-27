"use strict";

const axios = require("axios").default;
require("dotenv").config();

const getNextEvent = async () => {
    try {
        const res = await axios.post("http://" + process.env.API_ADDR + "/@querystring-search", {
            "sort_on": "start",
            "fullobjects": "1",
            "query": [
                {
                    "i": "portal_type",
                    "o": "plone.app.querystring.operation.selection.any",
                    "v": ["Event"]
                },
                {
                    "i": "end",
                    "o": "plone.app.querystring.operation.date.afterToday",
                    "v": []
                }
            ]
        }, httpHeaders);
        if (res.status === 200 && res.data.items_total > 0 && res.data.items[0].ig_attendees) { //check if at least 1 event exists and contains ig_attendees structure
            return res.data.items[0];
        } else if (res.status === 200 && res.data.items_total > 0) { //if event exists but has no ig_attendees structure, create structure.
            const currentEvent = res.data.items[0];
            const listTemplate = {ig_attendees:{ list:[]}};
            const preparedList = await patchEvent(listTemplate, currentEvent);
            return preparedList.data;
        } else { //no event found
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

const getComingEvents = async () => {
    try {
        const res = await axios.post("http://" + process.env.API_ADDR + "/@querystring-search", {
            "sort_on": "start",
            "fullobjects": "1",
            "query": [
                {
                    "i": "portal_type",
                    "o": "plone.app.querystring.operation.selection.any",
                    "v": ["Event"]
                },
                {
                    "i": "end",
                    "o": "plone.app.querystring.operation.date.afterToday",
                    "v": []
                }
            ]
        }, httpHeaders);
        // console.log(res.data.items.slice(0, 4).length);
        if (res.status === 200 && res.data.items_total > 0) {
            return res.data.items.slice(0, 4);
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

const serverUp = async () => {
    try {
        const res = await axios.get("http://" + process.env.API_ADDR, httpHeaders)
        if (res.status === 200) {
            return true;
        } else {
            console.log("serverUp() status: " + res.status);
            return false;
        }
    } catch (err) {
        console.log(err);
    }
}

const patchEvent = async (content, event) => {
    try {
        const res = await axios.patch(event["@id"], content, {
            headers: {
                "Authorization": "Basic " + process.env.API_AUTH,
                "Accept": "application/json",
                "Prefer": "return=representation",
                "Content-Type": "application/json"
            }
        });
        if (res.status === 200) {
            return res;
        } else {
            console.log("patchEvent() status: " + res.status);
            return false;
        }
    } catch (err) {
        console.error(err);
    }
}

const registerAttend = async (userinfo, event) => {
    const newEntry = {
        discord_name: userinfo.name,
        discord_id: userinfo.id,
        discord_dibs: userinfo.dibs
    };
    const newList = event.ig_attendees.list.concat(newEntry);
    const newDoc = {ig_attendees: {list: newList}};
    const res = await patchEvent(newDoc, event);
    if (res.status === 200) {
        return res;
    } else {
        return false;
    }
}

const checkAttendance = (userid, event) => { //checks if user attends event
    try {
        const attendeeList = event.ig_attendees.list;
        if (attendeeList.some(e => (e.discord_id === userid))) {
            return true; //attending
        } else {
            return false; //not attending
        }
    } catch (err) {
        console.error(err);
    }
}

const checkDibs = (userdibs, event) => { //checks if dibs is taken
    try {
        if (userdibs) {
            const attendeeList = event.ig_attendees.list;
            if (attendeeList.some(e => (e.discord_dibs === userdibs))) {
                return true; //dibs taken
            } else {
                return false; //dibs free
            }
        } else {
            return false; //return false if empty dibs
        }
    } catch (err) {
        console.error(err);
    }
}

function isValidHttpUrl(string) { // https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url 🤭
    let url;
    
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
  }

const httpHeaders = {
    headers: {
        "Authorization": "Basic " + process.env.API_AUTH,
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
}

module.exports = {
    getNextEvent, getComingEvents, serverUp, patchEvent, registerAttend, checkAttendance, checkDibs, isValidHttpUrl
}