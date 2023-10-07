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

        const guilds = client.guilds.cache.map(guild => guild.id);

        db.query(`CREATE TABLE IF NOT EXISTS guilds (
            guild_id VARCHAR(20) PRIMARY KEY,
            owner_id VARCHAR(20) NOT NULL,
            premium BOOLEAN NOT NULL DEFAULT FALSE
        )`)
        
        

        db.query(`CREATE TABLE IF NOT EXISTS users (
            user_id VARCHAR(20) PRIMARY KEY,
            permissionLevel INT NOT NULL DEFAULT 0
        )`)

        db.query(`CREATE TABLE IF NOT EXISTS tournaments (
            guild_id VARCHAR(20) NOT NULL PRIMARY KEY,
            in_progress BOOLEAN NOT NULL DEFAULT FALSE,
            game VARCHAR(20),
            number_of_teams INT NOT NULL DEFAULT 2,
            name_team_one VARCHAR(255),
            name_team_two VARCHAR(255),
            name_team_three VARCHAR(255),
            name_team_four VARCHAR(255),
            team_one VARCHAR(255),
            team_two VARCHAR(255),
            team_three VARCHAR(255),
            team_four VARCHAR(255)
        )`)


        // for (let i = 0; i < guilds.length; i++) {
        //     const guild = guilds[i];
        //     // await db.query(`INSERT INTO guilds (guild_id, owner_id) VALUES ('${guild}', '${client.guilds.cache.get(guild).ownerId}')`);
        //     log.db(`Added guild ${guild} to table guilds`);
        //     await db.query(`INSERT INTO tournaments (guild_id) VALUES ('${guild}')`);
        //     log.db(`Added guild ${guild} to table tournaments`);
        // }
    }
}