import { Event } from '@made-simple/discord.js';
import { Snowflake } from 'discord.js';
import { buckets, guildId, landingChannel, placements } from '../config.js';

export default new Event('guildMemberAdd').setExecutor(async (_, member) => {
    const guild = await member.guild.fetch();
    if (guild.id !== guildId) return;

    const landing = await guild.channels.fetch(landingChannel);
    if (!landing || !landing.isTextBased()) return;

    const placement = placements.find((p) => p.userId === member.id);

    if (placement) {
        const roles: Snowflake[] = [];
        for (const bucket of placement.buckets) {
            const data = buckets.find((b) => b.key === bucket);
            if (data) roles.push(data.role);
        }

        await member.roles.add(roles, 'user placement');

        await landing.send(
            `hello <@${
                member.id
            }> welcome. i am doggo. me bouncer.\nyou are cleared for these buckets:\n**${roles
                .toString()
                .replace(',', ', ')}**\ndm me for more info.`
        );
    } else {
        await landing.send(
            `i dont know you <@${member.id}>. tell me who you are. start with "i am".`
        );

        const filter = (message) => message.author.id === member.id;
        const collector = landing.createMessageCollector({
            filter,
            time: 60000
        });

        collector.once('collect', async (message) => {
            if (message.content.toLowerCase().includes('i am')) {
                const name = message.content
                    .split('i am')[1]
                    .trim()
                    .split('')
                    .map((char) => {
                        return Math.random() < 0.5
                            ? char.toUpperCase()
                            : char.toLowerCase();
                    })
                    .join('');
                await member.setNickname(
                    name,
                    'i am doggo bot. i do what i want.'
                );
                await landing.send(
                    `hello ${name}. i am doggo. youre not cleared for any bucket. you are a bucket. bark. dm me for more info.`
                );
            } else {
                await landing.send(
                    'wow. you are bad at listening. i am doggo. you are now doggo follower.'
                );
                await member.setNickname(
                    'doggo follower',
                    'because doggo follower.'
                );
            }

            collector.stop();
        });
    }
});
