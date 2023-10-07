const djs = require('discord.js');
const log = require('../logger');
const db = require('../db');
// const alert = require('../imports/alerts.js');

module.exports = {
    name: djs.Events.InteractionCreate,
    async execute(interaction) {
        let client = interaction.client;

        try {
            if (!interaction.isChatInputCommand()) return;
            let command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                log.error(`Command ${interaction.commandName} not found.`);
                return interaction.reply({ content: `Command not found`, ephemeral: true });
            }

            // get table users and check if user is in it and if not, add them
            let user = await db.query(`SELECT * FROM users WHERE user_id = '${interaction.user.id}'`);
            if (!user[0]) await db.query(`INSERT INTO users (user_id) VALUES ('${interaction.user.id}')`);
            
            // check if user has permission level 4
            if (command.module === 'dev' && user[0].permissionLevel !== 4) {
                log.cmd(`${interaction.user.id} tried to use command ${interaction.commandName} but is not a developer`)
                return interaction.reply({ content: `You are not a developer`, ephemeral: true });
            } 
            

            await command.execute(client, interaction);
            log.cmd(`${interaction.user.id} used command ${interaction.commandName} in ${interaction.guild.id}`)
        } catch (error) {
            console.log(error);
            log.error(`Command ${interaction.commandName} failed to execute.`);
            interaction.reply({ content: `An error occurred while using the command\nPlease send a message to [support](https://discord.gg/YfdEgx5yzF)`, ephemeral: true });
        }
    }
}