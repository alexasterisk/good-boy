import { Command } from '@made-simple/discord.js';
import { wipeMessages } from '../util/index.js';

export default new Command('clean', {
    allowedInDMs: false
})
    .setDescription('Clean messages from a channel')
    .setDefaultMemberPermissions(8240)
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();
        const guild = interaction.guild;
        if (!guild) return;

        await interaction.editReply('ok cleaning.');

        const completed = await wipeMessages(guild);
        if (!completed) {
            await interaction.editReply('failed to clean. i am bad doggo.');
            return;
        }

        await interaction.followUp('done. food?');
    });
