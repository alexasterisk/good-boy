import { Subcommand } from '@made-simple/discord.js';
import { keyv } from '../../util/index.js';
import { Blacklist } from './blacklist.js';

export default new Subcommand('whitelist')
    .setDescription('Removes a channel from the blacklist')
    .addChannelOption((option) =>
        option
            .setName('channel')
            .setDescription(
                'The channel to whitlist. Defaults to current channel'
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
        if (!blacklist.includes(channel.id)) {
            await interaction.editReply({
                content:
                    'this channel isnt even blacklisted. do you even pay attention'
            });
            return;
        }

        blacklist.push(channel.id);

        await keyv.set(`blacklist-${guild.id}`, blacklist);
        await interaction.editReply({
            content: 'ok removed from blacklist. i am good doggo.'
        });

        await interaction.followUp({
            content: 'food?'
        });
    });
