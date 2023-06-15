import { Subcommand } from '@made-simple/discord.js';
import { sendLandingMessage } from '../../util/sendLandingMessage.js';
import { TextChannel } from 'discord.js';

export default new Subcommand('create')
    .setDescription('Create a new landing message')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription('The channel to send the landing message in')
            .setRequired(false)
    )
    .setExecutor(async (_, interaction) => {
        const channel =
            interaction.options.getChannel('channel', false) ??
            interaction.channel;

        const { guild } = interaction;
        if (!guild) return;

        await sendLandingMessage(guild, channel as TextChannel).then(
            async () => {
                await interaction.reply('sent landing message.');
            }
        );
    });
