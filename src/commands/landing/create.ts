import { Subcommand } from '@made-simple/discord.js';
import { sendLandingMessage } from '../../util/sendLandingMessage.js';
import { TextChannel } from 'discord.js';
import { keyv } from '../../util/index.js';

export default new Subcommand('create')
    .setDescription('Create a new landing message')
    .setExecutor(async (_, interaction) => {
        const guild = interaction.guild;
        if (!guild) return;

        const channel = interaction.channel;
        if (!channel) return;

        await keyv.set(`landingChannel-${guild.id}`, channel.id);

        const sent = await sendLandingMessage(channel as TextChannel);
        if (!sent) {
            await interaction.reply('failed to send landing message.');
            return;
        }

        await interaction.reply('sent landing message.');
    });
