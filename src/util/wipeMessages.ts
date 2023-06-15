import { Guild, TextChannel } from 'discord.js';
import { keyv } from './index.js';
import { Blacklist } from '../commands/wipe/blacklist.js';

const messagesForWipe = [
    'channel has been wiped.',
    'channel clean. doggo good.',
    'got dusty. removed dirt.',
    'fetched broom. swept.',
    'cleaned. doggo happy.',
    'doggo best janitor.',
    'unpaid labor. doggo sad.',
    'sweep sweep. clean.',
    'clean up mess.',
    'ate leftovers. in trouble.'
];

export async function wipeMessages(
    guild: Guild,
    channel?: TextChannel,
    forced = false
): Promise<boolean> {
    const channels = channel
        ? new Map([[channel.id, channel]])
        : await guild.channels.fetch();

    const blacklist =
        (await keyv.get<Blacklist>(`blacklist-${guild.id}`)) ?? [];

    for (const channel of channels.values()) {
        if (!channel || !channel.isTextBased()) continue;

        if (!forced) {
            if (
                channel.name.includes('suggest') ||
                channel.name.includes('poll') ||
                channel.name.includes('idea') ||
                channel.name.includes('archive') ||
                channel.name.includes('todo')
            )
                continue;

            if (blacklist.includes(channel.id)) continue;
        }

        const messages = (await channel.messages.fetch())
            .filter((message) => !message.pinned)
            .filter((message) => {
                const date = new Date();
                date.setDate(date.getDate() - 14);
                return message.createdAt > date;
            });

        if (messages.size === 0) continue;

        for (let i = 0; i < Math.ceil(messages.size / 100); i++) {
            const messageArray = messages
                .map((message) => message)
                .slice(i * 100, (i + 1) * 100);

            for (let j = 0; j < 5; j++) {
                try {
                    await channel.bulkDelete(messageArray);
                    break;
                } catch (err) {
                    await new Promise((resolve) => setTimeout(resolve, 5000));
                }
            }
        }

        if (messages.size !== 1)
            await channel.send(
                'i am good doggo. ' +
                    messagesForWipe[
                        Math.floor(Math.random() * messagesForWipe.length)
                    ]
            );
    }

    return true;
}
