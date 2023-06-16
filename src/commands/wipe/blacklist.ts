import { Subcommand } from '@made-simple/discord.js';
import { keyv } from '../../util/index.js';

export type Blacklist = string[];

export default new Subcommand('blacklist')
    .setDescription('Blacklists a channel from being wiped')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription(
                'The channel to blacklist. Defaults to current channel'
            )
            .setRequired(false)
    )
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();

        const channel =
            interaction.options.getChannel('channel', false) ??
            interaction.channel;

        const { guild } = interaction;
        if (!guild || !channel) return;

        const blacklist =
            (await keyv.get<Blacklist>(`blacklist-${guild.id}`)) ?? [];
        if (blacklist.includes(channel.id)) {
            await interaction.editReply({
                content:
                    'this channel is already blacklisted. do you even pay attention'
            });
            return;
        }

        blacklist.push(channel.id);

        await keyv.set(`blacklist-${guild.id}`, blacklist);
        await interaction.editReply({
            content: 'ok blacklisted. i am good doggo.'
        });

        await interaction.channel?.send({
            content: 'food?'
        });
    });
