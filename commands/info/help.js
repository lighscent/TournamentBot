const djs = require('discord.js');
const log = require('../../logger');
const db = require('../../db');
const { getFooter } = require('../../functions');

module.exports = {
    module: "info",
    data: new djs.SlashCommandBuilder()
        .setName('help')
        .setDescription('Give some informations')
        .addSubcommand(subcommand => subcommand.setName('tournament').setDescription('Give some informations about the tournament'))
        .addSubcommand(subcommand => subcommand.setName('bot').setDescription('Give some informations about the bot'))
        .addSubcommand(subcommand => subcommand.setName('premium').setDescription('Give some informations about premium')),

    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'tournament') {
            
        }


        if (subcommand === 'bot') {
            // get last github commit description
            const commit = await require('child_process').execSync('git log --pretty=format:"%s" -n 1').toString();

            const embed = new djs.EmbedBuilder()
                .setTitle(`${client.user.username} - Information`)
                .setDescription(`I am a bot made by [Azukiov](https://github.com/Azukiov). You can have some support on my [support server](https://discord.gg/YfdEgx5yzF).`)
                .setColor("#800080")
                .addFields(
                    { name: "ID", value: `\`${client.user.id}\``, inline: true },
                    { name: "Guilds", value: `\`${client.guilds.cache.size}\``, inline: true },
                    { name: "Users", value: `\`${client.users.cache.size}\``, inline: true },
                    { name: 'Current version', value: `\`${commit}\``},
                )
                .setFooter(getFooter())
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        }

        if (subcommand === 'premium') {

        }
    }
};