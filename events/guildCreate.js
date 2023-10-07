const djs = require('discord.js');
const log = require('../logger');
const { cp } = require('fs');

module.exports = {
    name: djs.Events.GuildCreate,
    async execute(guild) {
        let client = guild.client;
        const guildDev = client.guilds.cache.get(process.env.GUILD_DEV);
        const channel = guildDev.channels.cache.get(process.env.ADDED_GUILD);

        const guildAvatar = guild.iconURL({ dynamic: true });
        const guildBanner = guild.bannerURL({ dynamic: true });


        const embed = new djs.EmbedBuilder()
            .setTitle(`New Guild! :tada:`)
            .setThumbnail(guildAvatar)
            .setImage(guildBanner)
            .setColor("#800080")
            .setDescription(`I am now in ${client.guilds.cache.size} guilds! :tada:`)
            .addFields(
                { name: "Name", value: `\`${guild.name}\``, inline: true },
                { name: "ID", value: `\`${guild.id}\``, inline: true },
                { name: "Owner", value: `\`${guild.ownerId}\``, inline: true },
                { name: "Member Count", value: `\`${guild.memberCount}\``, inline: true },
                { name: "Channels Count", value: `\`${guild.channels.cache.size}\``, inline: true },
                { name: "Roles Count", value: `\`${guild.roles.cache.size}\``, inline: true },
                { name: "Emojis Count", value: `\`${guild.emojis.cache.size}\``, inline: true },
                { name: "Created At", value: `\`${guild.createdAt}\``, inline: true },
                { name: "Boost Level", value: `\`${guild.premiumTier}\``, inline: true },
                { name: "Boost Count", value: `\`${guild.premiumSubscriptionCount}\``, inline: true },
                { name: "Region", value: `\`${guild.region}\``, inline: true },
                { name: "Vanity URL", value: `\`${guild.vanityURLCode}\``, inline: true }
            )
            .setTimestamp();

        try {
            await channel.send({ embeds: [embed] });
            log.info(`Sent guild added embed for ${guild.id}`);
        } catch (error) {
            log.error(`Failed to send guild added embed for ${guild.id}`);
        }
    }
};

