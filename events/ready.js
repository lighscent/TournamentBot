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

        db.query(`CREATE TABLE IF NOT EXISTS guilds (
            guild_id VARCHAR(20) PRIMARY KEY,
            owner_id VARCHAR(20) NOT NULL,
            premium BOOLEAN NOT NULL DEFAULT FALSE
        )`)

        db.query(`CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(20) PRIMARY KEY,
            permissionLevel INT NOT NULL DEFAULT 0
        )`)
    }
}