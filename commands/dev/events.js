const djs = require('discord.js');

module.exports = {
    module: "dev",
    data: new djs.SlashCommandBuilder()
        .setName('event')
        .setDescription('Simulate an event')
        .addStringOption(option => option.setName('event').setDescription('The event to simulate').setRequired(true)
            .addChoices(
                { name: 'guildCreate', value: 'guildCreate'}
                )),

    async execute(client, interaction) {
        const event = interaction.options.getString('event');

        if (event === 'guildCreate') {
            client.emit('guildCreate', interaction.guild)
        }

        await interaction.reply({ content: `Event ${event} emitted.`, ephemeral: true })
    }
}