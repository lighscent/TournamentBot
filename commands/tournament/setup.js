const djs = require('discord.js');
const log = require('../../logger');
const db = require('../../db');

module.exports = {
    module: "tournament",
    data: new djs.SlashCommandBuilder()
        .setDefaultMemberPermissions(djs.PermissionFlagsBits.ManageEvents)
        .setName('setup')
        .setDescription('Setup a tournament')
        .addSubcommand(subcommand => subcommand.setName('game')
            .setDescription('Set the game for the tournament')
            .addStringOption(option => option.setName('game').setDescription('The game to set').setRequired(true)
                .addChoices({ name: 'Counter-Strike 2', value: 'cs2' }, { name: 'Valorant', value: 'valorant' })))
        .addSubcommand(subcommand => subcommand.setName('number-of-teams').setDescription('Set the number of teams for the tournament')
            .addIntegerOption(option => option.setName('number').setDescription('The number of teams to set').setRequired(true).setMinValue(2).setMaxValue(4)))
        .addSubcommand(subcommand => subcommand.setName('name-team').setDescription('Set the name of a team')
            .addStringOption(option => option.setName('team').setDescription('The team to set').setRequired(true)
                .addChoices({ name: 'Team One', value: 'one' }, { name: 'Team Two', value: 'two' }, { name: 'Team Three', value: 'three' }, { name: 'Team Four', value: 'four' }))
            .addStringOption(option => option.setName('name').setDescription('The name to set').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('add-users').setDescription('Add users to the tournament')
            .addUserOption(option => option.setName('user').setDescription('The user to add').setRequired(true))
            .addStringOption(option => option.setName('team').setDescription('The team to add the user to').setRequired(true)
                .addChoices({ name: 'Team One', value: 'one' }, { name: 'Team Two', value: 'two' }, { name: 'Team Three', value: 'three' }, { name: 'Team Four', value: 'four' })))
        .addSubcommand(subcommand => subcommand.setName('remove-user').setDescription('Remove users from the tournament')
            .addUserOption(option => option.setName('user').setDescription('The user to remove').setRequired(true)))
        .addSubcommand(subcommand => subcommand.setName('transfer-user').setDescription('Transfer users from one team to another')
            .addUserOption(option => option.setName('user').setDescription('The user to transfer').setRequired(true))
            .addStringOption(option => option.setName('team').setDescription('The team to transfer the user to').setRequired(true)
                .addChoices({ name: 'Team One', value: 'one' }, { name: 'Team Two', value: 'two' }, { name: 'Team Three', value: 'three' }, { name: 'Team Four', value: 'four' })))



    ,
    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        const tournament = await db.query(`SELECT * FROM tournaments WHERE guild_id = '${interaction.guild.id}'`);
        if (tournament[0].in_progress) return interaction.reply({ content: ':x: A tournament is already in progress', ephemeral: true });

        const maxUserInTeam = [
            { valorant: 5, cs2: 5 },
        ]

        if (subcommand === 'game') {
            const game = interaction.options.getString('game');
            if (game === 'cs2') {
                await db.query(`UPDATE tournaments SET game = 'cs2' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: 'Game set to Counter-Strike 2', ephemeral: true });
            } else if (game === 'valorant') {
                await db.query(`UPDATE tournaments SET game = 'valorant' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: 'Game set to Valorant', ephemeral: true });
            }
        }

        if (subcommand === 'number-of-teams') {
            const number = interaction.options.getInteger('number');
            await db.query(`UPDATE tournaments SET number_of_teams = ${number} WHERE guild_id = '${interaction.guild.id}'`);
            await interaction.reply({ content: `Number of teams set to ${number}`, ephemeral: true });
        }

        if (subcommand === 'name-team') {
            const team = interaction.options.getString('team');
            const name = interaction.options.getString('name');
            if (tournament[0].number_of_teams === 2 && (team === 'three' || team === 'four')) return interaction.reply({ content: ':x: You can only have two teams', ephemeral: true });
            if (tournament[0].number_of_teams === 3 && team === 'four') return interaction.reply({ content: ':x: You can only have three teams', ephemeral: true });

            if (team === 'one') {
                await db.query(`UPDATE tournaments SET name_team_one = '${name}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Name of team one set to ${name}`, ephemeral: true });
            } else if (team === 'two') {
                await db.query(`UPDATE tournaments SET name_team_two = '${name}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Name of team two set to ${name}`, ephemeral: true });
            } else if (team === 'three') {
                await db.query(`UPDATE tournaments SET name_team_three = '${name}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Name of team three set to ${name}`, ephemeral: true });
            } else if (team === 'four') {
                await db.query(`UPDATE tournaments SET name_team_four = '${name}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Name of team four set to ${name}`, ephemeral: true });
            }
        }

        if (subcommand === 'add-users') {
            const user = interaction.options.getUser('user');
            const team = interaction.options.getString('team');
            if (tournament[0].number_of_teams === 2 && (team === 'three' || team === 'four')) return interaction.reply({ content: ':x: You can only have two teams', ephemeral: true });
            if (tournament[0].number_of_teams === 3 && team === 'four') return interaction.reply({ content: ':x: You can only have three teams', ephemeral: true });

            // to add users in a team ex: userID1, userID2, userID3, userID4, userID5

            let teamOne = tournament[0].team_one;
            let teamTwo = tournament[0].team_two;
            let teamThree = tournament[0].team_three;
            let teamFour = tournament[0].team_four;

            // check if user is already in a team 
            if (teamOne && teamOne.includes(user.id) || teamTwo && teamTwo.includes(user.id) || teamThree && teamThree.includes(user.id) || teamFour && teamFour.includes(user.id)) return interaction.reply({ content: ':x: User is already in a team', ephemeral: true });

            // if user is a bot return
            if (user.bot) return interaction.reply({ content: ':x: User is a bot', ephemeral: true });

            // check if team is full
            if (team === 'one' && teamOne.split(',').length === maxUserInTeam[0][tournament[0].game]) return interaction.reply({ content: ':x: Team one is full', ephemeral: true });
            if (team === 'two' && teamTwo.split(',').length === maxUserInTeam[0][tournament[0].game]) return interaction.reply({ content: ':x: Team two is full', ephemeral: true });
            if (team === 'three' && teamThree.split(',').length === maxUserInTeam[0][tournament[0].game]) return interaction.reply({ content: ':x: Team three is full', ephemeral: true });
            if (team === 'four' && teamFour.split(',').length === maxUserInTeam[0][tournament[0].game]) return interaction.reply({ content: ':x: Team four is full', ephemeral: true });

            if (team === 'one') {
                if (teamOne === null) {
                    teamOne = user.id;
                } else {
                    teamOne = teamOne + ',' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_one = '${teamOne}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team one`, ephemeral: true });
            } else if (team === 'two') {
                if (teamTwo === null) {
                    teamTwo = user.id;
                } else {
                    teamTwo = teamTwo + ',' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_two = '${teamTwo}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team two`, ephemeral: true });
            } else if (team === 'three') {
                if (teamThree === null) {
                    teamThree = user.id;
                } else {
                    teamThree = teamThree + ',' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_three = '${teamThree}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team three`, ephemeral: true });
            } else if (team === 'four') {
                if (teamFour === null) {
                    teamFour = user.id;
                } else {
                    teamFour = teamFour + ',' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_four = '${teamFour}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team four`, ephemeral: true });
            }
        }

        if (subcommand === 'remove-user') {
            const user = interaction.options.getUser('user');

            let teamOne = tournament[0].team_one;
            let teamTwo = tournament[0].team_two;
            let teamThree = tournament[0].team_three;
            let teamFour = tournament[0].team_four;

            if (teamOne && teamOne.includes(user.id)) {
                teamOne = teamOne.replace(user.id, '');
                teamOne = teamOne.replace(', ,', ',');
                await db.query(`UPDATE tournaments SET team_one = '${teamOne}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Removed ${user} from team one`, ephemeral: true });
            } else if (teamTwo && teamTwo.includes(user.id)) {
                teamTwo = teamTwo.replace(user.id, '');
                teamTwo = teamTwo.replace(',,', ',');
                await db.query(`UPDATE tournaments SET team_two = '${teamTwo}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Removed ${user} from team two`, ephemeral: true });
            } else if (teamThree && teamThree.includes(user.id)) {
                teamThree = teamThree.replace(user.id, '');
                teamThree = teamThree.replace(',,', ',');
                await db.query(`UPDATE tournaments SET team_three = '${teamThree}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Removed ${user} from team three`, ephemeral: true });
            } else if (teamFour && teamFour.includes(user.id)) {
                teamFour = teamFour.replace(user.id, '');
                teamFour = teamFour.replace(',,', ',');
                await db.query(`UPDATE tournaments SET team_four = '${teamFour}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Removed ${user} from team four`, ephemeral: true });
            } else {
                return interaction.reply({ content: ':x: User is not in a team', ephemeral: true });
            }
        }

        if (subcommand === 'transfer-user') {
            const user = interaction.options.getUser('user');
            const team = interaction.options.getString('team');

            let teamOne = tournament[0].team_one;
            let teamTwo = tournament[0].team_two;
            let teamThree = tournament[0].team_three;
            let teamFour = tournament[0].team_four;

            if (teamOne && teamOne.includes(user.id)) {
                teamOne = teamOne.replace(user.id, '');
                teamOne = teamOne.replace(', ,', ',');
                await db.query(`UPDATE tournaments SET team_one = '${teamOne}' WHERE guild_id = '${interaction.guild.id}'`);
            } else if (teamTwo && teamTwo.includes(user.id)) {
                teamTwo = teamTwo.replace(user.id, '');
                teamTwo = teamTwo.replace(', ,', ',');
                await db.query(`UPDATE tournaments SET team_two = '${teamTwo}' WHERE guild_id = '${interaction.guild.id}'`);
            } else if (teamThree && teamThree.includes(user.id)) {
                teamThree = teamThree.replace(user.id, '');
                teamThree = teamThree.replace(', ,', ',');
                await db.query(`UPDATE tournaments SET team_three = '${teamThree}' WHERE guild_id = '${interaction.guild.id}'`);
            } else if (teamFour && teamFour.includes(user.id)) {
                teamFour = teamFour.replace(user.id, '');
                teamFour = teamFour.replace(', ,', ',');
                await db.query(`UPDATE tournaments SET team_four = '${teamFour}' WHERE guild_id = '${interaction.guild.id}'`);
            } else {
                return interaction.reply({ content: ':x: User is not in a team', ephemeral: true });
            }

            if (team === 'one') {
                if (teamOne === null) {
                    teamOne = user.id;
                } else {
                    teamOne = teamOne + ', ' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_one = '${teamOne}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team one`, ephemeral: true });
            } else if (team === 'two') {
                if (teamTwo === null) {
                    teamTwo = user.id;
                } else {
                    teamTwo = teamTwo + ', ' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_two = '${teamTwo}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team two`, ephemeral: true });

            } else if (team === 'three') {
                if (teamThree === null) {
                    teamThree = user.id;
                } else {
                    teamThree = teamThree + ', ' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_three = '${teamThree}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team three`, ephemeral: true });
            } else if (team === 'four') {
                if (teamFour === null) {
                    teamFour = user.id;
                } else {
                    teamFour = teamFour + ', ' + user.id;
                }
                await db.query(`UPDATE tournaments SET team_four = '${teamFour}' WHERE guild_id = '${interaction.guild.id}'`);
                await interaction.reply({ content: `Added ${user} to team four`, ephemeral: true });
            }
        }
    }
}