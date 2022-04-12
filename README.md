# IG0r-bot
[Discord](https://discord.com) BOT used to manage attendance for a local arcade gaming meetup.

Events (meetups) are registered in a self hosted [Plone](https://plone.org/) CMS. Through IG0r users can register and show information about the next event with chat commands. For that to work IG0r sends requests to the Plone REST API.

### Main commands
* /dojo 

   Shows next event with info like date, attending users and taken/free sleeping accommodations.
* /attend

   Adds user to next event. With option to call dibs on a sleeping spot. Also used to change sleeping spot.
* /unattend

   Removes user from event.
* /undibs

   Frees up that users sleeping spot.
* /events

   Shows the next 4 events by date.
* /links

   Displays some useful links.
 
