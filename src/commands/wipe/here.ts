import { Subcommand } from '@made-simple/discord.js';
import { keyv, wipeMessages } from '../../util/index.js';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextChannel
} from 'discord.js';
import { Blacklist } from './blacklist.js';

export default new Subcommand('here')
    .setDescription('Clean messages from the current channel')
    .addBooleanOption((option) =>
        option
            .setName('forced')
            .setRequired(false)
            .setDescription(
                'Bypasses the confirmation message if the channel is blacklisted'
            )
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const { guild, channel } = interaction;
        if (!guild || !channel) return;

        const blacklist =
            (await keyv.get<Blacklist>(`blacklist-${guild.id}`)) ?? [];
        if (blacklist.includes(channel.id)) {
            const yesButton = new ButtonBuilder()
                .setCustomId('confirm')
                .setLabel('yes')
                .setStyle(ButtonStyle.Danger);

            const noButton = new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('no')
                .setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                yesButton,
                noButton
            );

            const sentMessage = await interaction.editReply({
                content:
                    'are you sure you want to wipe this channel?\ndoggo sees it is blacklisted.',
                components: [row]
            });

            const collector = sentMessage.createMessageComponentCollector({
                filter: (i) => i.user.id === interaction.user.id,
                time: 30000
            });

            collector.on('collect', async (i) => {
                if (i.customId === 'confirm') {
                    collector.stop('confirm');
                } else if (i.customId === 'cancel') {
                    collector.stop('cancel');
                }
            });

            collector.on('end', async (_, reason) => {
                if (reason === 'confirm') {
                    await interaction.editReply({
                        content: 'ok cleaning.',
                        components: []
                    });

                    const completed = await wipeMessages(
                        guild,
                        channel as TextChannel,
                        true
                    );
                    if (!completed) {
                        await interaction.editReply(
                            'failed to clean. i am bad doggo.'
                        );
                        return;
                    }

                    await interaction.followUp('done. food?');
                } else if (reason === 'cancel') {
                    await interaction.editReply({
                        content: 'ok not cleaning. good call.',
                        components: []
                    });
                } else {
                    await interaction.editReply({
                        content:
                            'wow. you run a command and then disappear. ok.',
                        components: []
                    });
                }
            });
        } else {
            await interaction.editReply('ok cleaning.');

            const completed = await wipeMessages(guild, channel as TextChannel);
            if (!completed) {
                await interaction.editReply('failed to clean. i am bad doggo.');
                return;
            }

            await interaction.channel?.send('done. food?');
        }
    });
