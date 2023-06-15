/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Subcommand } from '@made-simple/discord.js';
import { keyv } from '../../util/index.js';
import { LandingData } from './index.js';
import { Guild } from 'discord.js';

export const deleteLandingMessage = async (
    guild: Guild
): Promise<[boolean, string]> => {
    let response = '';
    const landingData =
        (await keyv.get<LandingData>(`landing-${guild.id}`)) ?? {};
    if (!landingData.message) {
        return [false, 'no landing message has ever been sent.'];
    }

    const channel = guild.channels.cache.get(landingData.channel!);
    if (!channel) {
        response = 'failed to get channel. assuming it was deleted? ';
    } else if (!channel.isTextBased()) {
        await keyv.delete(`landing-${guild.id}`);
        return [true, 'channel is not text based. why did you do this?'];
    }

    const message = await channel?.messages.fetch(landingData.message);
    if (!message) {
        response += 'failed to get message. assuming it was deleted?';
    } else {
        await message.delete();
    }

    await keyv.delete(`landing-${guild.id}`);
    return [true, response];
};

export default new Subcommand('delete')
    .setDescription('Deletes the landing message without sending a new one')
    .setExecutor(async (_, interaction) => {
        await interaction.deferReply();
        const { guild } = interaction;
        if (!guild) return;

        const [success, response] = await deleteLandingMessage(guild);
        if (!success) {
            await interaction.editReply({
                content: response
            });
        } else {
            await interaction.editReply({
                content: 'deleted landing message. i am good doggo.'
            });
        }
    });
