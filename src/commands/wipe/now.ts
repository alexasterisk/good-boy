import { Subcommand } from '@made-simple/discord.js';
import { wipeMessages } from '../../util/index.js';

export default new Subcommand('now')
    .setDescription('Clean messages from all channels minus the blacklist')
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const { guild } = interaction;
        if (!guild) return;

        await interaction.editReply('ok cleaning.');

        const completed = await wipeMessages(guild);
        if (!completed) {
            await interaction.editReply('failed to clean. i am bad doggo.');
            return;
        }

        await interaction.channel?.send('done. food?');
    });
