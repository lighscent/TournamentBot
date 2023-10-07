const djs = require('discord.js');
const log = require('../../logger');
const db = require('../../db');

module.exports = {
    module: "tournament",
    data: new djs.SlashCommandBuilder()
        .setName('teams')
        .setDescription('Show the teams for the tournament'),

    async execute(client, interaction) {
        const tournament = await db.query(`SELECT * FROM tournaments WHERE guild_id = '${interaction.guild.id}'`);
        if (!tournament || tournament.length === 0) return interaction.reply({ content: ':x: No tournament found', ephemeral: true });

        const teamOne = tournament[0].team_one ? tournament[0].team_one.split(',') : [];
        const teamTwo = tournament[0].team_two ? tournament[0].team_two.split(',') : [];
        const teamThree = tournament[0].team_three ? tournament[0].team_three.split(',') : [];
        const teamFour = tournament[0].team_four ? tournament[0].team_four.split(',') : [];

        let teamOneFormatted = '';
        let teamTwoFormatted = '';
        let teamThreeFormatted = '';
        let teamFourFormatted = '';

        for (let i = 0; i < teamOne.length; i++) {
            teamOneFormatted += `<@${teamOne[i]}>, `;
        }
        
        for (let i = 0; i < teamTwo.length; i++) {
            teamTwoFormatted += `<@${teamTwo[i]}>, `;
        }

        for (let i = 0; i < teamThree.length; i++) {
            teamThreeFormatted += `<@${teamThree[i]}>, `;
        }

        for (let i = 0; i < teamFour.length; i++) {
            teamFourFormatted += `<@${teamFour[i]}>, `;
        }




        const embed = new djs.EmbedBuilder()
            .setTitle(`Team one: ${tournament[0].name_team_one}`)
            .setDescription(`Users in team: ${teamOneFormatted}`)
            .setColor("#800080")
            .setTimestamp();

        const embed2 = new djs.EmbedBuilder()
            .setTitle(`Team two: ${tournament[0].name_team_two}`)
            .setDescription(`Users in team: ${teamTwoFormatted}`)
            .setColor("#800080")
            .setTimestamp();

        const embed3 = new djs.EmbedBuilder()
            .setTitle(`Team three: ${tournament[0].name_team_three}`)
            .setDescription(`Users in team: ${teamThreeFormatted}`)
            .setColor("#800080")
            .setTimestamp();

        const embed4 = new djs.EmbedBuilder()
            .setTitle(`Team four: ${tournament[0].name_team_four}`)
            .setDescription(`Users in team: ${teamFourFormatted}`)
            .setColor("#800080")
            .setTimestamp();


        if (tournament[0].number_of_teams === 2) {
            await interaction.reply({ embeds: [embed, embed2] });
        } else if (tournament[0].number_of_teams === 3) {
            await interaction.reply({ embeds: [embed, embed2, embed3] });
        } else if (tournament[0].number_of_teams === 4) {
            await interaction.reply({ embeds: [embed, embed2, embed3, embed4] });
        }



    }
};
