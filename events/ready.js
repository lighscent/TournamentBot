const djs = require('discord.js');
const log = require('../logger');
const db = require('../db');

module.exports = {
    name: djs.Events.ClientReady,
    async execute(client) {
        log.start(`Logged in as ${client.user.tag}!`)

        client.user.setPresence({
            status: 'online',
            activities: [
                {
                    name: 'Counter-Stike 2',
                    type: djs.ActivityType.Playing
                }
            ]
        });
    }
}